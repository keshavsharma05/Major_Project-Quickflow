# QuickFlow System Overview

## 1. Project Vision

QuickFlow is a high-performance quick-commerce fulfillment and optimization platform.

The system simulates and manages the complete lifecycle of customer orders, store inventory, demand, stock shortages, hub replenishment, allocation, and delivery.

The deeper engineering goal is to build a system capable of handling increasingly large workloads while measuring and demonstrating its performance, scalability, correctness, and reliability.

---

# 2. High-Level Architecture

```text
                         QUICKFLOW
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENTS                                 │
│                                                                 │
│  React Native          React Admin          Simulation / LoadGen │
│  Customer App          Operations UI          Virtual Users      │
│       │                      │                      │            │
└───────┼──────────────────────┼──────────────────────┼────────────┘
        │                      │                      │
        └──────────────────────┼──────────────────────┘
                               ↓
                    ┌─────────────────────┐
                    │     Node.js API     │
                    │                     │
                    │ Auth                │
                    │ Validation          │
                    │ Orchestration       │
                    │ Transactions        │
                    │ Engine Communication│
                    └──────────┬──────────┘
                               │
                 ┌─────────────┴─────────────┐
                 ↓                           ↓
        ┌─────────────────┐        ┌──────────────────┐
        │   SQL Database  │        │   C++ Engine     │
        │                 │        │                  │
        │ Durable State   │        │ Store Selection  │
        │ Orders          │        │ Demand Analysis  │
        │ Inventory       │        │ Shortage         │
        │ Stores          │        │ Priority         │
        │ Hubs            │        │ Allocation       │
        │ Deliveries      │        │ Replenishment    │
        │ Demand History  │        │ Delivery Planning│
        └─────────────────┘        └──────────────────┘
                 ↑                           │
                 │                           │
                 └─────────── Node ──────────┘
                               │
                               ↓
                    Events / Observability
                               │
                               ↓
                       Admin Dashboard

Performance Lab
    ↓
Simulation / Load Generators
    ↓
Docker / AWS
    ↓
Increasing Workloads
1K → 10K → 100K → 1M → 10M+