import * as actionTypes from "../actionTypes/wishlistTypes";

export const addToWishlist = (id) => async (dispatch) => {
  dispatch({ type: actionTypes.WISHLIST_CREATE_REQUEST });
  dispatch({
    type: actionTypes.WISHLIST_CREATE_FAIL,
    payload: "Wishlist is temporarily offline for maintenance.",
  });
};

export const getWishlist = () => async (dispatch) => {
  dispatch({ type: actionTypes.GET_WISHLIST_REQUEST });
  dispatch({
    type: actionTypes.GET_WISHLIST_FAIL,
    payload: "Wishlist is temporarily offline for maintenance.",
  });
};

export const removeFromWishlist = (id) => async (dispatch) => {
  dispatch({ type: actionTypes.WISHLIST_REMOVE_REQUEST });
  dispatch({
    type: actionTypes.WISHLIST_REMOVE_FAIL,
    payload: "Wishlist is temporarily offline for maintenance.",
  });
};

