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
  const { vegetables, loading, error } = allProducts;

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

  // Dynamic Product Page SEO updates
  useEffect(() => {
    if (product) {
      document.title = `${product.name} | Premium Gourmet Mushrooms – Shroooms`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", `Buy organic ${product.name} online in India. ${product.benefits || ''} - Premium quality doorstep delivery.`);
      }
    }
  }, [product]);

  if (loading) {
    return (
      <div className="pdp-loading-container">
        <div className="pdp-spinner"></div>
        <p>Loading Product Details...</p>
      </div>
    );
  }

  const isErrorTrigger = productId === "trigger-error";
  if (isErrorTrigger || (error && (!vegetables || vegetables.length === 0))) {
    const displayError = isErrorTrigger ? "Database connection timeout. Failed to fetch harvest catalog." : error;
    return (
      <div className="pdp-error-container" style={{
        padding: "4rem 2rem",
        textAlign: "center",
        maxWidth: "600px",
        margin: "8rem auto"
      }}>
        <i className="fa fa-exclamation-triangle" style={{ fontSize: "4rem", color: "#d9534f", marginBottom: "1.5rem" }}></i>
        <h2 style={{ fontSize: "2.2rem", fontWeight: "600", color: "#333", marginBottom: "1rem" }}>Connection Issue</h2>
        <p style={{ fontSize: "1.4rem", color: "#666", marginBottom: "2rem" }}>
          {displayError.toString()}
        </p>
        <Link to="/" className="btn-primary" style={{ padding: "1.2rem 2.8rem", textDecoration: "none", display: "inline-block", borderRadius: "30px", backgroundColor: "#1e352f", color: "#fff" }}>
          Back to Home
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pdp-not-found-container" style={{
        padding: "4rem 2rem",
        textAlign: "center",
        maxWidth: "600px",
        margin: "8rem auto"
      }}>
        <i className="fa fa-search" style={{ fontSize: "4rem", color: "#777", marginBottom: "1.5rem" }}></i>
        <h2 style={{ fontSize: "2.2rem", fontWeight: "600", color: "#333", marginBottom: "1rem" }}>Product Not Found</h2>
        <p style={{ fontSize: "1.4rem", color: "#666", marginBottom: "2rem" }}>
          The requested product ID "{productId}" could not be found in our harvest catalog.
        </p>
        <Link to="/" className="btn-primary" style={{ padding: "1.2rem 2.8rem", textDecoration: "none", display: "inline-block", borderRadius: "30px", backgroundColor: "#1e352f", color: "#fff" }}>
          Browse Gourmet Catalog
        </Link>
      </div>
    );
  }

  // Helper to parse benefits into bullet points
  const getBenefitsList = (benefitsText) => {
    if (!benefitsText) return [
      "Culinary ingredient with a delicate flavor profile and firm texture.",
      "Suitable for sautéing, grilling, or incorporating into stocks and soups.",
      "Store in a dry, paper bag under refrigeration for optimal shelf life.",
      "Gently clean with a brush before preparation; avoid soaking in water."
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
