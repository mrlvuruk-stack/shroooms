import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { AddItemPrimary } from "../../components/Buttons/AddItem";
import { RemoveItemPrimary } from "../../components/Buttons/RemoveItem";
import { purchasingState } from "../../store/actions/actionCreators/addToCartAction";
import { signInOpen } from "../../store/actions/actionCreators/signInAction";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../../store/actions/actionCreators/wishlistAction";

import "./Product.css";

const Product = ({ product }, props) => {
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.cart);
  const fullWishlist = useSelector((state) => state.fullWishlist);
  const userSignIn = useSelector((state) => state.userSignIn);

  const { wishlist } = fullWishlist;
  const { userInfo } = userSignIn;

  const [inWishlist, setInWishlist] = useState(false);

  // Dynamic cart item state from Redux store to avoid mutating product props
  const cartItem = cart?.cartData?.vegetablesCart?.find((x) => x._id === product._id);
  const isPurchasing = cartItem ? cartItem.purchasing : false;
  const quantity = cartItem ? cartItem.quantity : 0;

  useEffect(() => {
    dispatch(getWishlist());
  }, [dispatch]);

  useEffect(() => {
    wishlist &&
      wishlist.map((x) => {
        if (x.product === product._id) {
          setInWishlist(true);
        }
        return true;
      });
  }, [product, wishlist]);

  useEffect(() => {
    !wishlist && setInWishlist(false);
  }, [product, wishlist]);

  useEffect(() => {
    if (userInfo) {
      dispatch(getWishlist());
    }
  }, [userInfo, dispatch]);

  const wishlistIcon = () => {
    if (!userInfo) {
      return (
        <i className="fa fa-heart-o" onClick={() => dispatch(signInOpen())}></i>
      );
    } else {
      if (inWishlist) {
        return (
          <i
            className="fa fa-heart"
            onClick={() => dispatch(removeFromWishlist(product._id))}
          ></i>
        );
      } else {
        return (
          <i
            className="fa fa-heart-o"
            onClick={() => dispatch(addToWishlist(product._id))}
          ></i>
        );
      }
    }
  };

  const getBadgeClass = (badge) => {
    if (!badge) return "pc-badge--fresh";
    const b = badge.toLowerCase();
    if (b.includes("organic")) return "pc-badge--organic";
    if (b.includes("chef")) return "pc-badge--chef";
    if (b.includes("rare")) return "pc-badge--rare";
    if (b.includes("seller")) return "pc-badge--bestseller";
    if (b.includes("superfood")) return "pc-badge--superfood";
    if (b.includes("adaptogen")) return "pc-badge--adaptogen";
    if (b.includes("premium")) return "pc-badge--premium";
    return "pc-badge--fresh";
  };

  return (
    <div key={product._id} className="card pc-card">
      {/* Top Badges Row */}
      {product.badge && (
        <div className="pc-badges">
          <span className={`pc-badge ${getBadgeClass(product.badge)}`}>
            {product.badge}
          </span>
        </div>
      )}

      {/* Wishlist corner */}
      <div className="pc-corner-right">
        {wishlistIcon()}
      </div>

      {/* Image Section */}
      <div className="pc-image-wrapper">
        <Link
          to={{
            pathname: `/product/${product._id}`,
            state: {
              modal: true,
            },
          }}
        >
          <img src={product.image} alt={product.name} className="pc-image" />
        </Link>
      </div>

      {/* Body Info */}
      <div className="cardBody pc-body">
        <span className="pc-brand">
          {product.benefits || "Gourmet Mushroom"}
        </span>
        
        <Link
          to={{
            pathname: `/product/${product._id}`,
            state: {
              modal: true,
            },
          }}
        >
          <h2 className="pc-title">{product.name}</h2>
        </Link>

        <div className="pc-meta-row">
          <div className="quantity pc-unit">{product.unit}</div>
        </div>

        <div className="priceCart pc-action-row">
          <div className="pc-price-block">
            <span className="price pc-price-now">&#8377;{product.price}</span>
            <span className="pc-price-mrp">&#8377;{Math.round(product.price * 1.25)}</span>
          </div>

          <div className="pc-cta-wrapper">
            {!isPurchasing ? (
              <button
                onClick={() => dispatch(purchasingState(product._id))}
                className="cartbtn pc-add-btn"
              >
                + Add
              </button>
            ) : (
              <div className="btnpurchasing pc-stepper">
                <RemoveItemPrimary product={product} />
                <p className="quantityCounter">{quantity}</p>
                <AddItemPrimary product={product} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
