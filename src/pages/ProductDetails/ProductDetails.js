import React, { useEffect, useState } from "react";
import "animate.css";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  purchasingState,
  incrementItem,
  decrementItem
} from "../../store/actions/actionCreators/addToCartAction";
import vegetablesList from "../../store/actions/actionCreators/productsListAction";
import "./ProductDetails.css";

const ProductDetails = (props) => {
  const dispatch = useDispatch();
  const allProducts = useSelector((state) => state.products);
  const cart = useSelector((state) => state.cart);
  const { vegetables, loading } = allProducts;

  const productId = props.match.params.id;
  const product = vegetables?.find((x) => x._id === productId);

  // Dynamic cart item lookup
  const cartItem = cart?.cartData?.vegetablesCart?.find((x) => x._id === product?._id);
  const isPurchasing = cartItem ? cartItem.purchasing : false;
  const quantity = cartItem ? cartItem.quantity : 0;

  // Accordion states
  const [benefitsOpen, setBenefitsOpen] = useState(true);
  const [descriptionOpen, setDescriptionOpen] = useState(false);

  // Load products if store is empty on direct page refresh
  useEffect(() => {
    if (!vegetables || vegetables.length === 0) {
      dispatch(vegetablesList());
    }
  }, [dispatch, vegetables]);

  if (loading || !product) {
    return (
      <div className="pdp-loading-container">
        <div className="pdp-spinner"></div>
        <p>Loading Product Details...</p>
      </div>
    );
  }

  // Helper to parse benefits into bullet points
  const getBenefitsList = (benefitsText) => {
    if (!benefitsText) return [
      "Rich in antioxidants that support cellular health.",
      "Supports natural immune system function.",
      "Helps maintain healthy health parameters.",
      "Natural source of essential minerals and B-vitamins."
    ];
    return benefitsText
      .split(/[.!?]+/)
      .map(item => item.trim())
      .filter(item => item.length > 0);
  };

  const benefitsList = getBenefitsList(product.benefits);

  return (
    <div className="pdp-page-wrapper animate__animated animate__fadeIn">
      {/* Breadcrumb / Back Navigation */}
      <div className="pdp-breadcrumb">
        <Link to="/" className="breadcrumb-link">Home</Link>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>

      <div className="pdp-grid-container">
        {/* Left Side: Product Image Card */}
        <div className="pdp-left-image-section">
          <div className="pdp-image-card">
            <span className="pdp-arrival-badge">
              {product.badge || "NEW ARRIVAL"}
            </span>
            <div className="pdp-image-wrapper-box">
              <img src={product.image} alt={product.name} className="pdp-main-image" />
            </div>
          </div>
        </div>

        {/* Right Side: Product Custom Details */}
        <div className="pdp-right-info-section">
          <h1 className="pdp-product-title">{product.name}</h1>
          
          {/* Ratings Block */}
          <div className="pdp-rating-row">
            <div className="pdp-stars">
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
              <i className="fa fa-star"></i>
            </div>
            <span className="pdp-reviews-count">(4.8 / 124 reviews)</span>
          </div>

          {/* Price Block */}
          <div className="pdp-price-block">
            <span className="pdp-price-label">MRP: </span>
            <span className="pdp-price-value">₹{product.price}</span>
            <p className="pdp-tax-notice">(Inclusive of all taxes)</p>
          </div>

          {/* Weight Selection */}
          <div className="pdp-weight-block">
            <span className="pdp-section-label">AVAILABLE IN:</span>
            <div className="pdp-weight-pills">
              <button className="pdp-weight-pill active">
                {product.unit}
              </button>
            </div>
          </div>

          {/* Action / Stepper & Add to Cart Row */}
          <div className="pdp-actions-row">
            {isPurchasing ? (
              <div className="pdp-stepper-pill">
                <button 
                  onClick={() => dispatch(decrementItem(product._id))} 
                  className="pdp-stepper-btn"
                >
                  <i className="fa fa-minus"></i>
                </button>
                <span className="pdp-stepper-value">{quantity}</span>
                <button 
                  onClick={() => dispatch(incrementItem(product._id))} 
                  className="pdp-stepper-btn"
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            ) : (
              <div className="pdp-stepper-pill disabled-stepper">
                <button className="pdp-stepper-btn" disabled>
                  <i className="fa fa-minus"></i>
                </button>
                <span className="pdp-stepper-value">1</span>
                <button className="pdp-stepper-btn" disabled>
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            )}

            {!isPurchasing ? (
              <button
                onClick={() => dispatch(purchasingState(product._id))}
                className="pdp-add-to-cart-btn"
              >
                <i className="fa fa-shopping-bag pdp-btn-icon"></i>
                Add to Cart
              </button>
            ) : (
              <button
                onClick={() => props.history.push("/checkout")}
                className="pdp-add-to-cart-btn pdp-checkout-shortcut"
              >
                <i className="fa fa-credit-card pdp-btn-icon"></i>
                Checkout Now
              </button>
            )}
          </div>

          {/* Benefits Accordion */}
          <div className="pdp-accordion-item">
            <div 
              className="pdp-accordion-header" 
              onClick={() => setBenefitsOpen(!benefitsOpen)}
            >
              <h3>Benefits</h3>
              <i className={`fa fa-chevron-${benefitsOpen ? "up" : "down"} pdp-arrow`}></i>
            </div>
            {benefitsOpen && (
              <div className="pdp-accordion-body animate__animated animate__fadeIn">
                <ul className="pdp-benefits-list">
                  {benefitsList.map((benefit, idx) => (
                    <li key={idx} className="pdp-benefit-item">
                      <i className="fa fa-check-circle pdp-check-icon"></i>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Description Accordion */}
          <div className="pdp-accordion-item">
            <div 
              className="pdp-accordion-header" 
              onClick={() => setDescriptionOpen(!descriptionOpen)}
            >
              <h3>Description</h3>
              <i className={`fa fa-chevron-${descriptionOpen ? "up" : "down"} pdp-arrow`}></i>
            </div>
            {descriptionOpen && (
              <div className="pdp-accordion-body animate__animated animate__fadeIn">
                <p className="pdp-description-text">{product.description}</p>
              </div>
            )}
          </div>

          {/* Trust Badges Footer Row */}
          <div className="pdp-trust-badges-row">
            <div className="pdp-trust-badge">
              <span className="pdp-badge-circle">
                <i className="fa fa-leaf"></i>
              </span>
              <span className="pdp-badge-text">Organic</span>
            </div>
            <div className="pdp-trust-badge">
              <span className="pdp-badge-circle">
                <i className="fa fa-tint"></i>
              </span>
              <span className="pdp-badge-text">Pure Extracts</span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
