/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { sendOrderDetails } from "../../../store/actions/actionCreators/orderAction";
import ErrorBox from "../../ErrorBox/ErrorBox";
import LoadingBox from "../../LoadingBox/LoadingBox";

import "./Payment.css";

const Payment = (props) => {
  const cart = useSelector((state) => state.cart);

  const newOrder = useSelector((state) => state.newOrder);
  const { loading, success, error } = newOrder;

  const { taxes, shipping, totalPay } = props;

  const dispatch = useDispatch();

  const successPaymentHandler = () => {
    dispatch(
      sendOrderDetails({
        orderItems: cart.cartData.vegetablesCart,
        customerAddress: cart.customerAddress,
        cartTotal: cart.cartData.cartTotal,
        taxes: taxes,
        shippingPrice: shipping,
        totalPrice: totalPay,
        isPaid: true,
      })
    );
  };

  useEffect(() => {
    if (success) {
      props.history.push("/orders");
    }
  }, [success, props.history]);

  return (
    <div className={`checkout-step ${props.paymentStep}`}>
      <span className="checkout-step__number">3</span>
      <span className="checkout-step__name" data-test-id="payment-title">
        Payment
      </span>
      <div className="checkout-step__body checkout-step__body--payment-step">
        <div className="payment--details">
          <div>
            <p>Total Price: </p>
            <p>{cart.cartData.cartTotal}&#8377;</p>
          </div>
          <div>
            <p>Shipping: </p>
            <p>{shipping === 0 ? "Free" : { shipping }}</p>
          </div>
          <div>
            <p>Taxes: </p>
            <p>{taxes}&#8377;</p>
          </div>
        </div>
        <div className="payment--total">
          <p>Total Pay: </p>
          <p>{totalPay}&#8377;</p>
        </div>
        <div className="checkout-payment-disabled-notice" style={{
          padding: "1.5rem",
          background: "rgba(220, 95, 0, 0.1)",
          border: "1px solid rgba(220, 95, 0, 0.3)",
          borderRadius: "8px",
          color: "#c05600",
          fontSize: "1.4rem",
          textAlign: "center",
          margin: "1.5rem 0",
          fontWeight: "500",
          lineHeight: "1.5"
        }}>
          Online ordering is being finalized. Please <a href="/contact" style={{ textDecoration: "underline", color: "inherit", fontWeight: "bold" }}>contact us</a> for order assistance.
        </div>
        <button
          disabled
          type="button"
          className="btn-pay-demo btn-pay-disabled"
          style={{
            width: "100%",
            padding: "1.4rem 2.8rem",
            backgroundColor: "#ccc",
            color: "#666",
            fontSize: "1.5rem",
            fontWeight: "600",
            border: "none",
            borderRadius: "30px",
            cursor: "not-allowed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          Pay &#8377;{totalPay} & Place Order (Disabled)
        </button>
        {loading && <LoadingBox></LoadingBox>}
        {error && <ErrorBox varient="error">{error}</ErrorBox>}
      </div>
    </div>
  );
};

export default withRouter(Payment);
