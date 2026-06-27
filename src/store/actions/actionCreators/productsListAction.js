import axios from "axios";
import * as actionTypes from "../actionTypes/productsListTypes";

const vegetablesList = () => async (dispatch, getState) => {
  dispatch({
    type: actionTypes.VEGETABLE_LIST_REQUEST,
  });
  try {
    const { data } = await axios.get("/api/products");

    // Merge cart state (quantity/purchasing) into fetched products
    // BUT only for products that still exist in the fetched list.
    // This prevents deleted products from being re-injected via cart data.
    if (localStorage.getItem("cartItems")) {
      const cartProducts = getState().cart.cartData.vegetablesCart;
      cartProducts.forEach((cartItem) => {
        const index = data.findIndex((x) => x._id === cartItem._id);
        if (index > -1) {
          // Product still exists — merge cart state
          data[index] = { ...data[index], quantity: cartItem.quantity, purchasing: cartItem.purchasing };
        }
        // If index === -1, product was deleted — do NOT add it back
      });
    }

    dispatch({
      type: actionTypes.VEGETABLE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({ type: actionTypes.VEGETABLE_LIST_FAIL, payload: error.message });
  }
};

export const filteredProducts = (value) => (dispatch) => {
  dispatch({
    type: actionTypes.VEGETABLE_FILTER_SEARCH,
    payload: value,
  });
};

export default vegetablesList;
