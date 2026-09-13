# QuickFlow — Architecture Decision Records

> This document records the architectural decisions behind QuickFlow, including **what was chosen, why it was chosen, what alternatives were considered, and what trade-offs were accepted.**

The goal is not to prove that every decision is perfect.

The goal is to make the reasoning **visible, reviewable, and reversible when evidence proves it wrong.**

---

## Decision Status

| Status              | Meaning                      |
| ------------------- | ---------------------------- |
| 🟢 **Accepted**     | Decision is currently frozen |
| 🟡 **Proposed**     | Under discussion             |
| 🔵 **Experimental** | Being tested                 |
| 🔴 **Rejected**     | Explicitly rejected          |
| ⚪ **Superseded**    | Replaced by a newer decision |

---

# ADR-001 · Node.js as the Application Orchestrator

**Status:** 🟢 Accepted

### Decision

Node.js + Express will act as the primary application orchestration layer.

### Responsibilities

* API handling
* Authentication
* Authorization
* Validation
* Order orchestration
* State transitions
* Database transactions
* C++ communication
* Applying engine decisions
* Event generation

### Why

QuickFlow requires a layer capable of handling large amounts of I/O-bound application activity while coordinating multiple subsystems.

Node.js fits the API/orchestration role without forcing CPU-heavy optimization into the request layer.

### Rejected approach

Putting optimization algorithms directly inside Node.

### Why rejected

CPU-heavy computation would compete with API/event-loop work and make the system harder to reason about and benchmark.

### Trade-off

Node must communicate with the C++ engine, introducing an additional boundary and serialization/communication overhead.

### Principle

> **Node coordinates. It does not become the optimization engine.**

---

# ADR-002 · SQL as the Authoritative State Store

**Status:** 🟢 Accepted

### Decision

SQL will be the authoritative durable source of QuickFlow state.

### State includes

* Orders
* Products
* Stores
* Inventory
* Hubs
* Demand history
* Forecasts
* Replenishment
* Deliveries

### Why

Inventory and order management require:

* Transactions
* Constraints
* Relationships
* Durability
* Concurrency control
* Consistent state

### Trade-off

Database access introduces latency.

That cost is accepted because incorrect inventory state is much worse than a database operation being slightly slower.

### Principle

> **SQL remembers what actually happened.**

---

# ADR-003 · C++20 as the Optimization Engine

**Status:** 🟢 Accepted

### Decision

C++20 will handle computationally intensive optimization workloads.

### Initial responsibilities

* Store selection
* Shortage detection
* Priority calculation
* Hub allocation
* Replenishment planning
* Delivery planning
* Routing

### Why

QuickFlow specifically aims to investigate high-performance computation.

C++ provides an environment where we can investigate:

* Algorithm complexity
* Data structures
* Memory layout
* Cache behavior
* CPU utilization
* Parallelism
* Multithreading
* Benchmark scaling

### Important clarification

C++ is **not** being added merely because "C++ is fast."

The actual algorithms and data structures must produce measurable value.

### Principle

> **Use C++ where computation justifies it.**

---

# ADR-004 · C++ Does Not Directly Mutate the Database

**Status:** 🟢 Accepted

### Decision

The C++ engine produces decisions.

Node applies those decisions through controlled database operations.

```text
C++ Engine
    ↓
Decision
    ↓
Node
    ↓
SQL Transaction
    ↓
Updated State
```

### Why

Direct database mutation from C++ would tightly couple computation with persistence.

That would make:

* Testing harder
* Failure handling harder
* Database ownership unclear
* Transactions harder to coordinate
* Service boundaries weaker

### Principle

> **C++ decides. Node applies. SQL persists.**

---

# ADR-005 · Separate Forecasting from Optimization

**Status:** 🟢 Accepted

### Decision

Demand forecasting and operational optimization are separate responsibilities.

```text
Historical Demand
      ↓
Forecasting
      ↓
Expected Demand
      ↓
C++ Optimization
```

### Forecasting asks

> What demand should we expect?

### Optimization asks

> Given that expectation and the current constraints, what should we do?

### Why

Forecasting models may evolve independently from operational algorithms.

This allows us to replace or improve the forecasting layer without rewriting the fulfillment engine.

---

# ADR-006 · Forecasts Are Generated Periodically / in Batches

**Status:** 🟢 Accepted

### Decision

The system will not run a complete ML forecast independently for every store/SKU on every incoming order.

Forecasts will be generated periodically or in batches.

### Why

Consider:

```text
3,000 stores
×
5,000 SKUs
=
15,000,000 store-SKU combinations
```

Running expensive prediction logic independently for every operational event would be wasteful.

### Architecture

```text
Historical Data
      ↓
Forecast Job
      ↓
Batch Predictions
      ↓
Forecast Storage
      ↓
C++ Operational Decisions
```

### Trade-off

Forecasts may not reflect every transaction immediately.

The operational layer compensates by reacting to real-time inventory and actual demand changes.

---

# ADR-007 · Two Clocks for the System

**Status:** 🟢 Accepted

QuickFlow separates:

### Forecasting Clock

```text
Periodic / Batch
```

### Operational Clock

```text
Continuous / Event-driven
```

### Why

These workloads have fundamentally different latency requirements.

Forecasting can tolerate batch execution.

Order fulfillment and inventory operations require rapid reaction.

---

# ADR-008 · Database Transactions Protect Inventory

**Status:** 🟢 Accepted

### Decision

Inventory reservations must use database transactions and appropriate concurrency control.

### Problem

```text
Inventory = 10

Customer A → 7
Customer B → 6
```

Both requests may arrive almost simultaneously.

### Required behavior

Only valid reservations may succeed.

### Principle

```text
Read State
   ↓
Protect State
   ↓
Validate
   ↓
Modify
   ↓
Commit
```

### Why

Inventory overselling is a state-consistency failure.

It cannot be solved merely by having a "correct" optimization algorithm.

---

# ADR-009 · Separate Decision Correctness from State Correctness

**Status:** 🟢 Accepted

QuickFlow recognizes two different forms of correctness.

### Decision correctness

Owned primarily by C++.

Example:

```text
Best Store = B
```

### State correctness

Owned by Node + SQL.

Example:

```text
Store B actually has enough inventory
and the reservation is atomic.
```

### Why

A correct optimization decision can become invalid if the underlying state changes between computation and application.

Therefore:

> **A mathematically correct decision does not automatically produce a correct system state.**

---

# ADR-010 · Simulation Uses the Real System

**Status:** 🟢 Accepted

### Decision

The simulation will interact with the actual QuickFlow architecture.

### Not allowed

```text
Fake Simulation
      ↓
Fake Inventory
      ↓
Fake Dashboard
```

### Required

```text
Simulation
      ↓
Real API
      ↓
Real Database
      ↓
Real C++ Engine
      ↓
Real State Changes
      ↓
Real Admin Dashboard
```

### Why

The simulation exists to test and demonstrate the actual system.

A disconnected simulation cannot prove that the architecture works.

---

# ADR-011 · Virtual Users Instead of Physical Processes

**Status:** 🟢 Accepted

### Decision

Large simulations will represent users as lightweight virtual-user state machines.

Example:

```text
Browse
 ↓
Select
 ↓
Cart
 ↓
Order
 ↓
Track
 ↓
Repeat
```

### Why

A million users do not require a million operating-system processes.

Virtual users allow large populations to be represented efficiently.

### Important distinction

```text
1M virtual users
≠
1M computers
≠
1M processes
```

---

# ADR-012 · Docker Is Not a Performance Optimization

**Status:** 🟢 Accepted

### Decision

Docker will provide:

* Reproducible environments
* Packaging
* Isolation
* Easy replication
* Deployment consistency

### Docker does NOT automatically provide

* Faster algorithms
* Faster APIs
* Faster databases
* More CPU
* Better architecture

### Principle

> **Docker changes how the system runs. It does not magically change how fast the system computes.**

---

# ADR-013 · AWS for Large-Scale Experiments

**Status:** 🟢 Accepted

### Decision

AWS may be used to run larger workloads and distributed load generators.

### Why

Local hardware limits the amount of traffic and computational workload that can be generated.

Cloud infrastructure allows experiments involving:

```text
Load Generator
      ↓
Multiple Machines
      ↓
Load Balancer
      ↓
Multiple API Instances
```

### Trade-off

Cloud infrastructure introduces:

* Cost
* Operational complexity
* Deployment complexity

Therefore cloud usage must be tied to measurable experiments.

---

# ADR-014 · No Message Broker in V1 by Default

**Status:** 🟢 Accepted

### Decision

A dedicated message broker will not automatically be introduced in V1.

### Why

The initial system can keep event handling within the application architecture while the workload remains manageable.

### Future trigger

A broker may be introduced if measurements demonstrate a need for:

* High event throughput
* Strong service decoupling
* Asynchronous processing
* Durable event delivery
* Independent consumer scaling

### Principle

> **Complexity must solve a demonstrated problem.**

---

# ADR-015 · Admin Dashboard Is an Operations Center

**Status:** 🟢 Accepted

### Decision

The admin dashboard will visualize actual system behavior.

It is not simply CRUD.

### It should expose

* Orders
* Inventory
* Demand
* Stockouts
* Replenishment
* Hub allocation
* Deliveries
* C++ decisions
* Engine events
* Simulation state
* Performance metrics

### Why

QuickFlow's complexity needs to be observable.

The dashboard becomes the visual explanation of the architecture.

---

# ADR-016 · Failures Must Preserve Valid State

**Status:** 🟢 Accepted

### Decision

Failures must not leave the system in an invalid state.

### Examples

```text
C++ crashes
Database unavailable
Duplicate request
Delivery fails
Hub inventory insufficient
Simulation crashes
```

### Principle

```text
Success
   ↓
Commit valid state

Failure
   ↓
Preserve valid state
```

---

# ADR-017 · Idempotency for Dangerous Operations

**Status:** 🟢 Accepted

### Decision

Operations that could produce duplicate state mutations should support idempotency.

Example:

```text
Request ID = ABC123

First request
→ Process

Retry
→ Detect ABC123
→ Return previous result
```

### Why

Networks fail.

Clients retry.

Load generators retry.

Humans double-click buttons.

The system should not create duplicate state because the network had a brief existential crisis.

---

# ADR-018 · Performance Claims Require Measurements

**Status:** 🟢 Accepted

### Decision

QuickFlow will not claim scalability based on architecture diagrams alone.

### Metrics

* Latency
* Throughput
* CPU
* Memory
* Engine runtime
* Database performance
* Concurrency
* Scaling behavior

### Workload progression

```text
1K
 ↓
10K
 ↓
100K
 ↓
1M
 ↓
10M+
```

Actual measurements will be recorded after experiments.

### Principle

> **Ultrafast is not an architecture. It is a measurement.**

---

# ADR-019 · Two Performance Tracks

**Status:** 🟢 Accepted

QuickFlow will measure two distinct dimensions.

## System Performance

```text
Users
 ↓
HTTP
 ↓
API
 ↓
Database / Engine
```

Measures the complete application.

## Algorithm Performance

```text
Large Problem
 ↓
C++ Engine
 ↓
Algorithm Runtime
```

Measures computational scalability.

### Why

A fast algorithm does not guarantee a fast system.

A scalable API does not guarantee that the optimization engine will survive large problem sizes.

Both must be measured.

---

# ADR-020 · V1 Optimizes for Completeness Before Scale

**Status:** 🟢 Accepted

### V1 world

```text
1 Hub
3 Stores
5 SKUs
1 Truck
Multiple Customers
Multiple Orders
```

### Goal

Demonstrate the complete operational loop:

```text
Order
 ↓
Store Selection
 ↓
Reservation
 ↓
Demand
 ↓
Shortage
 ↓
Replenishment
 ↓
Hub Allocation
 ↓
Delivery
 ↓
Inventory Restoration
```

### Why

A complete small system is more valuable than a huge architecture where half the components are decorative.

---

# ADR-021 · Architecture Evolves Through Measurement

**Status:** 🟢 Accepted

QuickFlow will follow:

```text
             ┌──────────────┐
             │     Build    │
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │    Measure   │
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │ Find Bottleneck│
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │ Understand   │
             │    Cause     │
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │   Optimize   │
             └──────┬───────┘
                    ↓
             ┌──────────────┐
             │ Measure Again│
             └──────────────┘
```

This prevents premature architecture.

---

# Decision Log

| ID      | Decision                                    | Status      |
| ------- | ------------------------------------------- | ----------- |
| ADR-001 | Node.js as orchestrator                     | 🟢 Accepted |
| ADR-002 | SQL as authoritative state                  | 🟢 Accepted |
| ADR-003 | C++20 optimization engine                   | 🟢 Accepted |
| ADR-004 | C++ does not directly mutate SQL            | 🟢 Accepted |
| ADR-005 | Forecasting separated from optimization     | 🟢 Accepted |
| ADR-006 | Batch / periodic forecasting                | 🟢 Accepted |
| ADR-007 | Separate forecasting and operational clocks | 🟢 Accepted |
| ADR-008 | Transactions protect inventory              | 🟢 Accepted |
| ADR-009 | Decision vs state correctness               | 🟢 Accepted |
| ADR-010 | Simulation uses real system                 | 🟢 Accepted |
| ADR-011 | Virtual users                               | 🟢 Accepted |
| ADR-012 | Docker is not optimization                  | 🟢 Accepted |
| ADR-013 | AWS for scale experiments                   | 🟢 Accepted |
| ADR-014 | No broker by default in V1                  | 🟢 Accepted |
| ADR-015 | Admin as operations center                  | 🟢 Accepted |
| ADR-016 | Failure-safe state                          | 🟢 Accepted |
| ADR-017 | Idempotency                                 | 🟢 Accepted |
| ADR-018 | Measured performance                        | 🟢 Accepted |
| ADR-019 | Two performance tracks                      | 🟢 Accepted |
| ADR-020 | Complete V1 before massive scale            | 🟢 Accepted |
| ADR-021 | Measurement-driven evolution                | 🟢 Accepted |

---

# Current Architectural Principle

```text
┌──────────────────────────────────────────────────┐
│                  QUICKFLOW                       │
├──────────────────────────────────────────────────┤
│                                                  │
│  CUSTOMER      → expresses intent                │
│  NODE          → orchestrates                    │
│  SQL           → owns durable state              │
│  ML            → predicts demand                 │
│  C++           → computes decisions               │
│  SIMULATION    → generates workload              │
│  ADMIN         → exposes system behavior         │
│  BENCHMARKS    → provide evidence                │
│  DOCKER/AWS    → provide execution infrastructure│
│                                                  │
└──────────────────────────────────────────────────┘
```

> **Build the simplest architecture that can demonstrate the real problem. Then let measurements earn the complexity.**

---

## Architecture Status

**Phase:** Foundation & System Architecture

**Decision status:** Actively evolving

**Implementation:** Not yet frozen

Every major architectural decision should be added here before implementation begins.
