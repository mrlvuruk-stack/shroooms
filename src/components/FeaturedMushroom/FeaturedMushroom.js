import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HOMEPAGE_CONFIG } from "../../config/homepageConfig";
import { AddItemPrimary } from "../Buttons/AddItem";
import { RemoveItemPrimary } from "../Buttons/RemoveItem";
import { purchasingState } from "../../store/actions/actionCreators/addToCartAction";
import "./FeaturedMushroom.css";

const FeaturedMushroom = () => {
  const dispatch = useDispatch();
  const vegetables = useSelector((state) => state.products.vegetables) || [];
  const cart = useSelector((state) => state.cart);
  const { featuredMushroom, featuredProducts } = HOMEPAGE_CONFIG;

  const selectSpotlight = () => {
    if (!vegetables || vegetables.length === 0) return null;

    // Priority 1: Match targetNameKeyword in config
    const target = featuredMushroom.targetNameKeyword;
    let match = vegetables.find((veg) =>
      veg.name?.toLowerCase().includes(target.toLowerCase())
    );
    if (match) return match;

    // Priority 2: First item of Featured Products configured names
    const firstFeaturedName = featuredProducts?.configuredNames?.[0];
    if (firstFeaturedName) {
      match = vegetables.find((veg) =>
        veg.name?.toLowerCase().includes(firstFeaturedName.toLowerCase())
      );
      if (match) return match;
    }

    // Priority 3: First catalog product
    return vegetables[0];
  };

  const product = selectSpotlight();

  if (!product) return null;

  // Retrieve dynamic cart info for the selected spotlight product
  const cartItem = cart?.cartData?.vegetablesCart?.find((x) => x._id === product._id);
  const isPurchasing = cartItem ? cartItem.purchasing : false;
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <section className="spotlight-section home-section container-wide" aria-labelledby="spotlight-title">
      <div className="spotlight-container">
        
        {/* Left Column: Visual stage, holds image now, reserves 3D stage */}
        <div className="spotlight-visual-col">
          <div className="featured-mushroom-3d-boundary">
            <div className="spotlight-radial-glow" aria-hidden="true" />
            <img
              src={product.image}
              alt={`Gourmet ${product.name} ready for kitchen preparation`}
              className="spotlight-product-image"
              loading="lazy"
              decoding="async"
              style={{ aspectRatio: "1 / 1" }}
            />
          </div>
        </div>

        {/* Right Column: Copy and purchase flow */}
        <div className="spotlight-content-col">
          <div className="spotlight-header">
            <span className="spotlight-eyebrow" id="spotlight-title">{featuredMushroom.badge}</span>
            <h2 className="spotlight-name">{product.name}</h2>
            <div className="spotlight-meta-row">
              <span className="spotlight-scientific">{featuredMushroom.scientificName}</span>
              <span className="spotlight-sep" aria-hidden="true">·</span>
              <span className="spotlight-unit">{product.unit}</span>
            </div>
          </div>

          <p className="spotlight-description">
            {product.description || "Gourmet culinary variety grown locally in Indore under precise controlled environment vertical chambers."}
          </p>

          <div className="spotlight-action-row">
            <div className="spotlight-price-block">
              <span className="spotlight-price">&#8377;{product.price}</span>
              <span className="spotlight-mrp">&#8377;{Math.round(product.price * 1.25)}</span>
            </div>

            <div className="spotlight-cta-wrapper">
              {!isPurchasing ? (
                <button
                  onClick={() => dispatch(purchasingState(product._id))}
                  className="btn-primary spotlight-add-btn"
                  aria-label={`Add ${product.name} to cart`}
                >
                  + Add to Cart
                </button>
              ) : (
                <div className="spotlight-stepper">
                  <RemoveItemPrimary product={product} />
                  <span className="spotlight-quantity" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
                  <AddItemPrimary product={product} />
                </div>
              )}
            </div>
          </div>

          <div className="spotlight-footer-cta">
            <Link to={`/product/${product._id}`} className="btn-secondary spotlight-details-link">
              {featuredMushroom.buttonText} <span className="btn-arrow" aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

      </div>
    </section>
  );
};

export default FeaturedMushroom;
