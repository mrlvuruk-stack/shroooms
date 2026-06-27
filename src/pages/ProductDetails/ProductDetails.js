import React from "react";
import "animate.css";
import { useDispatch, useSelector } from "react-redux";
import { RemoveItemSecondary } from "../../components/Buttons/RemoveItem";
import { AddItemSecondary } from "../../components/Buttons/AddItem";
import { purchasingState } from "../../store/actions/actionCreators/addToCartAction";

import "./ProductDetails.css";

const ProductDetails = (props) => {
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.products);
  const cart = useSelector((state) => state.cart);
  const { vegetables } = allProducts;

  const product = vegetables?.find((x) => x._id === props.match.params.id);

  // Dynamic cart item lookup
  const cartItem = cart?.cartData?.vegetablesCart?.find((x) => x._id === product?._id);
  const isPurchasing = cartItem ? cartItem.purchasing : false;
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div role="button" className="modal" onClick={() => props.history.goBack()}>
      <div
        role="button"
        className="product animate__animated animate__fadeIn"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="product__detail">
          <img src={product?.image} alt={product?.name} className="medium full" />
          <div className="product__description">
            <h3>Benefits</h3>
            <p style={{ fontWeight: "600", color: "var(--frugivore-forest)", marginBottom: "1rem" }}>{product?.benefits}</p>
            <h3>Description</h3>
            <p>{product?.description}</p>
          </div>
        </div>
        <div className="product__cart">
          <h3>{product?.name}</h3>
          <h4>
            MRP: <span>&#8377;{product?.price}</span>
          </h4>
          <p>(Inclusive of all taxes)</p>
          <h5>Available in:</h5>
          <h6>{product?.unit}</h6>
          {!isPurchasing ? (
            <button
              onClick={() => dispatch(purchasingState(product._id))}
              className="cartbtn productbtn"
            >
              Add to Cart
            </button>
          ) : (
            <div className="btnpurchasing purchase-secondary">
              <RemoveItemSecondary product={product} />
              <p className="secondary-counter">{quantity}</p>
              <AddItemSecondary product={product} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
