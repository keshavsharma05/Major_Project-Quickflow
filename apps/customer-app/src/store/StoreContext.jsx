import React, { createContext, useContext, useReducer } from 'react';
import { 
  INITIAL_USER, 
  INITIAL_ADDRESSES, 
  INITIAL_CATEGORIES, 
  INITIAL_PRODUCTS, 
  INITIAL_ORDERS,
  INITIAL_STORES
} from '../data/db';

const StoreContext = createContext();

const initialState = {
  user: INITIAL_USER,
  addresses: INITIAL_ADDRESSES,
  categories: INITIAL_CATEGORIES,
  products: INITIAL_PRODUCTS,
  orders: INITIAL_ORDERS,
  stores: INITIAL_STORES,
  cart: [],
  activeOrder: null,
};

function storeReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.cart.find(i => i.productId === action.payload.productId);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map(i => 
            i.productId === action.payload.productId 
              ? { ...i, qty: i.qty + action.payload.qty } 
              : i
          )
        };
      }
      return { ...state, cart: [...state.cart, action.payload] };
    }
    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        cart: state.cart.filter(i => i.productId !== action.payload.productId)
      };
    }
    case 'UPDATE_CART_QTY': {
      return {
        ...state,
        cart: state.cart.map(i =>
          i.productId === action.payload.productId
            ? { ...i, qty: action.payload.qty }
            : i
        ).filter(i => i.qty > 0)
      };
    }
    case 'CLEAR_CART': {
      return { ...state, cart: [] };
    }
    case 'CREATE_ORDER': {
      return {
        ...state,
        orders: [action.payload, ...state.orders],
        cart: [],
        activeOrder: action.payload
      };
    }
    case 'UPDATE_ORDER_STATUS': {
      return {
        ...state,
        orders: state.orders.map(o => 
          o.id === action.payload.orderId 
            ? { ...o, status: action.payload.status }
            : o
        ),
        activeOrder: state.activeOrder?.id === action.payload.orderId 
          ? { ...state.activeOrder, status: action.payload.status }
          : state.activeOrder
      };
    }
    case 'RESET_DEMO': {
      return initialState;
    }
    default:
      return state;
  }
}

export const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(storeReducer, initialState);

  // Helper actions
  const addToCart = (productId, qty = 1) => {
    dispatch({ type: 'ADD_TO_CART', payload: { productId, qty } });
  };

  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: { productId } });
  };

  const updateCartQty = (productId, qty) => {
    dispatch({ type: 'UPDATE_CART_QTY', payload: { productId, qty } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  const createOrder = (addressId, paymentMethod) => {
    // calculate total
    const itemTotal = state.cart.reduce((sum, item) => {
      const product = state.products.find(p => p.id === item.productId);
      return sum + (product.price * item.qty);
    }, 0);
    
    // add delivery fee if below 299
    const deliveryFee = itemTotal > 0 && itemTotal < 299 ? 25 : 0;
    const packagingFee = 10;
    const total = itemTotal + deliveryFee + packagingFee;

    const newOrder = {
      id: 'ORD-' + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      status: 'Confirmed',
      total,
      items: state.cart.map(i => {
        const product = state.products.find(p => p.id === i.productId);
        return { productId: i.productId, qty: i.qty, price: product.price };
      }),
      addressId,
      paymentMethod
    };

    dispatch({ type: 'CREATE_ORDER', payload: newOrder });
    return newOrder;
  };

  return (
    <StoreContext.Provider value={{ 
      state, 
      dispatch,
      addToCart,
      removeFromCart,
      updateCartQty,
      clearCart,
      createOrder
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
