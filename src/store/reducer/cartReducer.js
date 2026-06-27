import * as actionTypes from "../actions/actionTypes/addToCartTypes";
import * as actionT from "../actions/actionTypes/orderTypes";

const loadCartData = () => {
  const local = localStorage.getItem("cartItems");
  if (!local) return { vegetablesCart: [], totalQuantity: 0, cartTotal: 0 };
  try {
    const parsed = JSON.parse(local);
    if (parsed && Array.isArray(parsed.vegetablesCart)) {
      // Recalculate totals to self-heal any out-of-sync or corrupted state
      const totalQuantity = parsed.vegetablesCart.reduce((acc, item) => acc + (item.quantity || 0), 0);
      const cartTotal = parsed.vegetablesCart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0);
      return {
        vegetablesCart: parsed.vegetablesCart,
        totalQuantity,
        cartTotal,
      };
    }
  } catch (e) {
    // Ignore error
  }
  return {
    vegetablesCart: [],
    totalQuantity: 0,
    cartTotal: 0,
  };
};

const initialState = {
  cartData: loadCartData(),
  sideBarOpen: false,
  customerAddress: localStorage.getItem("customerAddress")
    ? JSON.parse(localStorage.getItem("customerAddress"))
    : {},
};

const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.PURCHASING_STATE: {
      const product = action.payload;
      if (!product) return state;

      // Clone existing items to avoid direct mutation
      const cartPurchasingArray = state.cartData.vegetablesCart.map(item => ({ ...item }));
      const existingItem = cartPurchasingArray.find(
        (x) => x._id === product._id
      );

      if (existingItem) {
        existingItem.quantity += 1;
        existingItem.purchasing = true;
      } else {
        const newItem = {
          ...product,
          quantity: 1,
          purchasing: true
        };
        cartPurchasingArray.push(newItem);
      }

      const totalQuantity = cartPurchasingArray.reduce((acc, item) => acc + item.quantity, 0);
      const cartTotal = cartPurchasingArray.reduce((acc, item) => acc + item.price * item.quantity, 0);

      return {
        ...state,
        cartData: {
          vegetablesCart: cartPurchasingArray,
          totalQuantity,
          cartTotal,
        },
      };
    }

    case actionTypes.INCREMENT_ITEM: {
      const cartIncrementArray = state.cartData.vegetablesCart.map(item => ({ ...item }));
      const incrementingItem = cartIncrementArray.find(
        (x) => x._id === action.id
      );

      if (incrementingItem) {
        incrementingItem.quantity += 1;
      }

      const totalQuantity = cartIncrementArray.reduce((acc, item) => acc + item.quantity, 0);
      const cartTotal = cartIncrementArray.reduce((acc, item) => acc + item.price * item.quantity, 0);

      return {
        ...state,
        cartData: {
          vegetablesCart: cartIncrementArray,
          cartTotal,
          totalQuantity,
        },
      };
    }

    case actionTypes.DECREMENT_ITEM: {
      let cartDecrementArray = state.cartData.vegetablesCart.map(item => ({ ...item }));
      const decrementingItem = cartDecrementArray.find(
        (x) => x._id === action.id
      );

      if (decrementingItem) {
        decrementingItem.quantity -= 1;
        if (decrementingItem.quantity <= 0) {
          decrementingItem.purchasing = false;
          cartDecrementArray = cartDecrementArray.filter(x => x._id !== action.id);
        }
      }

      const totalQuantity = cartDecrementArray.reduce((acc, item) => acc + item.quantity, 0);
      const cartTotal = cartDecrementArray.reduce((acc, item) => acc + item.price * item.quantity, 0);

      return {
        ...state,
        cartData: {
          vegetablesCart: cartDecrementArray,
          cartTotal,
          totalQuantity,
        },
      };
    }
    case actionTypes.SEND_CUSTOMER_ADDRESS:
      return {
        ...state,
        customerAddress: action.payload,
      };
    case actionT.CLEAR_CART:
      return {
        ...state,
        cartData: {
          vegetablesCart: [],
          totalQuantity: 0,
          cartTotal: 0,
        },
      };
    case actionTypes.SIDEBAR_OPEN:
      return {
        ...state,
        sideBarOpen: true,
      };
    case actionTypes.SIDEBAR_CLOSE:
      return {
        ...state,
        sideBarOpen: false,
      };
    default:
      return state;
  }
};

export default cartReducer;
