import axios from "axios";
import supabase from "../../../supabase";
import * as actionTypes from "../actionTypes/orderTypes";

export const sendOrderDetails = (orderDetails) => async (dispatch) => {
  dispatch({ type: actionTypes.ORDER_CREATE_REQUEST });

  try {
    const { idempotencyKey, name, email, phone, address, cartItems } = orderDetails;

    // Map cartItems to exactly what the RPC p_items expects: product_id and quantity
    const p_items = cartItems.map((item) => ({
      product_id: item._id,
      quantity: item.quantity,
    }));

    // Call Supabase RPC
    const { data, error } = await supabase.rpc("create_order_secure", {
      p_idempotency_key: idempotencyKey,
      p_name: name,
      p_email: email,
      p_phone: phone,
      p_address: address,
      p_items: p_items,
    });

    if (error) {
      let category = "RETRYABLE_FAILURE";
      let code = error.code || "P1999";
      let safeMessage = "An error occurred while submitting your order request. Please try again.";

      // Handle expected custom SQLSTATE codes mapped to messages
      if (error.message) {
        const msg = error.message;
        if (msg.includes("P1001") || msg.includes("INVALID_IDEMPOTENCY_KEY")) {
          category = "EXPECTED_VALIDATION";
          code = "P1001";
          safeMessage = "Idempotency key is invalid.";
        } else if (msg.includes("P1002") || msg.includes("INVALID_NAME")) {
          category = "EXPECTED_VALIDATION";
          code = "P1002";
          safeMessage = "Please enter a valid name (up to 100 characters). No special control characters.";
        } else if (msg.includes("P1003") || msg.includes("INVALID_EMAIL")) {
          category = "EXPECTED_VALIDATION";
          code = "P1003";
          safeMessage = "Please enter a valid email address.";
        } else if (msg.includes("P1004") || msg.includes("INVALID_PHONE")) {
          category = "EXPECTED_VALIDATION";
          code = "P1004";
          safeMessage = "Please enter a valid phone number (8 to 20 digits).";
        } else if (msg.includes("P1005") || msg.includes("INVALID_ADDRESS")) {
          category = "EXPECTED_VALIDATION";
          code = "P1005";
          safeMessage = "Please enter a valid delivery address (5 to 500 characters).";
        } else if (msg.includes("P1006") || msg.includes("INVALID_ITEMS")) {
          category = "EXPECTED_VALIDATION";
          code = "P1006";
          safeMessage = "Your cart items are invalid.";
        } else if (msg.includes("P1007") || msg.includes("TOO_MANY_RAW_ITEMS")) {
          category = "EXPECTED_VALIDATION";
          code = "P1007";
          safeMessage = "Too many items in the request.";
        } else if (msg.includes("P1008") || msg.includes("INVALID_ITEM_SHAPE")) {
          category = "EXPECTED_VALIDATION";
          code = "P1008";
          safeMessage = "Invalid item structure.";
        } else if (msg.includes("P1009") || msg.includes("INVALID_PRODUCT_ID")) {
          category = "EXPECTED_VALIDATION";
          code = "P1009";
          safeMessage = "One of the product identifiers is invalid.";
        } else if (msg.includes("P1010") || msg.includes("INVALID_QUANTITY")) {
          category = "EXPECTED_VALIDATION";
          code = "P1010";
          safeMessage = "One of the quantities is invalid (max 50 per product).";
        } else if (msg.includes("P1011") || msg.includes("TOO_MANY_ITEMS")) {
          category = "EXPECTED_VALIDATION";
          code = "P1011";
          safeMessage = "Too many distinct items (max 15 allowed).";
        } else if (msg.includes("P1012") || msg.includes("PRODUCT_NOT_FOUND")) {
          category = "EXPECTED_VALIDATION";
          code = "P1012";
          safeMessage = "One of the products in your cart was not found.";
        } else if (msg.includes("P1013") || msg.includes("INVALID_PRODUCT_PRICE")) {
          category = "EXPECTED_VALIDATION";
          code = "P1013";
          safeMessage = "Invalid product pricing detected.";
        } else if (msg.includes("P1014") || msg.includes("ORDER_TOTAL_TOO_LARGE")) {
          category = "EXPECTED_VALIDATION";
          code = "P1014";
          safeMessage = "Order total is too large.";
        }
      }

      dispatch({ type: actionTypes.ORDER_CREATE_FAIL, payload: safeMessage });
      return {
        ok: false,
        category,
        code,
        safeMessage,
      };
    }

    if (!data || !Array.isArray(data) || data.length === 0) {
      const err = "Empty response received from the server.";
      dispatch({ type: actionTypes.ORDER_CREATE_FAIL, payload: err });
      return {
        ok: false,
        category: "RETRYABLE_FAILURE",
        code: "P1999",
        safeMessage: "Empty response received from the server. Please try again.",
      };
    }

    const { order_request_id, result_code } = data[0];

    // Response validation
    if (result_code !== "ORDER_REQUEST_CREATED" && result_code !== "ORDER_REQUEST_ALREADY_EXISTS") {
      const err = "Invalid response status from the server.";
      dispatch({ type: actionTypes.ORDER_CREATE_FAIL, payload: err });
      return {
        ok: false,
        category: "RETRYABLE_FAILURE",
        code: "P1999",
        safeMessage: "Invalid response status from the server. Please try again.",
      };
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!order_request_id || !uuidRegex.test(order_request_id)) {
      const err = "Missing or malformed order request identifier.";
      dispatch({ type: actionTypes.ORDER_CREATE_FAIL, payload: err });
      return {
        ok: false,
        category: "RETRYABLE_FAILURE",
        code: "P1999",
        safeMessage: "Missing or malformed order request identifier.",
      };
    }

    // Return normalized success
    dispatch({ type: actionTypes.ORDER_CREATE_SUCCESS, payload: { order_request_id, result_code } });
    return {
      ok: true,
      orderRequestId: order_request_id,
      resultCode: result_code,
    };
  } catch (err) {
    let category = "RETRYABLE_FAILURE";
    let code = "P1999";
    let safeMessage = "An error occurred while submitting your order request. Please try again.";

    dispatch({ type: actionTypes.ORDER_CREATE_FAIL, payload: safeMessage });
    return {
      ok: false,
      category,
      code,
      safeMessage,
    };
  }
};

export const userOrderDetails = () => async (dispatch, getState) => {
  dispatch({ type: actionTypes.USER_ORDER_REQUEST });
  try {
    const {
      userSignIn: { userInfo },
    } = getState();
    const { data } = await axios.get("/api/orders/myorders", {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    });

    dispatch({ type: actionTypes.USER_ORDER_SUCCESS, payload: data });
  } catch (err) {
    dispatch({
      type: actionTypes.USER_ORDER_FAIL,
      payload:
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
    });
  }
};
