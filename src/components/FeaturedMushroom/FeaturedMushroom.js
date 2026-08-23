import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { HOMEPAGE_CONFIG } from "../../config/homepageConfig";
import { AddItemPrimary } from "../Buttons/AddItem";
import { RemoveItemPrimary } from "../Buttons/RemoveItem";
import { purchasingState } from "../../store/actions/actionCreators/addToCartAction";
import { InfoModal } from "../ModalSystem/ModalSystem";
import "./FeaturedMushroom.css";

const FeaturedMushroom = () => {
  const dispatch = useDispatch();
  const vegetables = useSelector((state) => state.products.vegetables) || [];
  const cart = useSelector((state) => state.cart);
  const { featuredMushroom, featuredProducts } = HOMEPAGE_CONFIG;
  const [showInfoModal, setShowInfoModal] = useState(false);

  const selectSpotlight = () => {
    if (!vegetables || vegetables.length === 0) return null;

    const target = featuredMushroom.targetNameKeyword;
    let match = vegetables.find((veg) =>
      veg.name?.toLowerCase().includes(target.toLowerCase())
    );
    if (match) return match;

    const firstFeaturedName = featuredProducts?.configuredNames?.[0];
    if (firstFeaturedName) {
      match = vegetables.find((veg) =>
        veg.name?.toLowerCase().includes(firstFeaturedName.toLowerCase())
      );
      if (match) return match;
    }

    return vegetables[0];
  };

  const product = selectSpotlight();

  if (!product) return null;

  const cartItem = cart?.cartData?.vegetablesCart?.find((x) => x._id === product._id);
  const isPurchasing = cartItem ? cartItem.purchasing : false;
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <section className="spotlight-section home-section container-wide" aria-labelledby="spotlight-title">
      <div className="spotlight-container">
        
        {/* Left Column: Organic Circular Visual Stage */}
        <div className="spotlight-visual-col">
          <div className="organic-circular-stage">
            <div className="spotlight-radial-glow" aria-hidden="true" />
            <img
              src={product.image}
              alt={`Gourmet ${product.name} ready for kitchen preparation`}
              className="spotlight-product-image organic-circle-img"
              loading="lazy"
              decoding="async"
            />
            <button
              className="spotlight-info-float-btn"
              onClick={() => setShowInfoModal(true)}
              aria-label="View spotlight species policy & details"
              title="View Species Policy"
            >
              i
            </button>
          </div>
        </div>

        {/* Right Column: Copy and purchase flow */}
        <div className="spotlight-content-col">
          <div className="spotlight-header">
            <span className="spotlight-eyebrow" id="spotlight-title">{featuredMushroom.badge}</span>
            <div className="title-with-info">
              <h2 className="spotlight-name">{product.name}</h2>
              <button
                className="info-trigger-btn inline-info-btn"
                onClick={() => setShowInfoModal(true)}
                aria-label="View information"
                title="View details & policy"
              >
                i
              </button>
            </div>
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

      {/* Flagship Cultivar Info Modal */}
      {showInfoModal && (
        <InfoModal
          isOpen={showInfoModal}
          onClose={() => setShowInfoModal(false)}
          title={`${product.name} — Flagship Cultivar Standard`}
          icon="🦁"
          details={product.description || "Premium Lion's Mane gourmet variety cultivated inside clean vertical chambers."}
          bullets={[
            "Rich in bioactive Hericenones & Erinacines for natural focus and nerve growth support",
            "Dense meaty texture with delicate seafood & lobster culinary flavor notes",
            "Harvested fresh daily at dawn in Indore and shipped in insulated cold packs"
          ]}
        />
      )}
    </section>
  );
};

export default FeaturedMushroom;
