import React from "react";
import { Link } from "react-router-dom";
import { MUSHROOM_GUIDE_DATA } from "../../config/mushroomGuideConfig";
import { resolveProductForGuideItem } from "../../pages/MushroomGuide/mushroomGuideUtils";
import "./GuideProductConnection.css";

const GuideProductConnection = ({ products }) => {
  if (!products || !Array.isArray(products) || products.length === 0) {
    return null;
  }

  // Resolve unique products for species in MUSHROOM_GUIDE_DATA (max 3)
  const resolvedProductsMap = new Map();

  for (const item of MUSHROOM_GUIDE_DATA) {
    const prod = resolveProductForGuideItem(item, products);
    if (prod && prod._id && !resolvedProductsMap.has(prod._id)) {
      resolvedProductsMap.set(prod._id, {
        product: prod,
        species: item
      });
    }
    if (resolvedProductsMap.size >= 3) break;
  }

  const items = Array.from(resolvedProductsMap.values());

  if (items.length === 0) {
    return null;
  }

  return (
    <section className="guide-products-section" aria-label="Available SHROOOMS Products">
      <div className="guide-products-header">
        <span className="guide-products-eyebrow">From Our Farm</span>
        <h2 className="guide-products-title">Fresh Mushroom Cultivars</h2>
        <p className="guide-products-subtitle">
          Explore locally grown gourmet mushrooms harvested at peak freshness and ready for your kitchen.
        </p>
      </div>

      <div className="guide-products-grid">
        {items.map(({ product, species }) => {
          // Use claim-free raw species image if product image matches pouch artwork
          const displayImage = species && species.image ? species.image : (product.image || "/shrooom.jpg");

          return (
            <article key={product._id} className="guide-prod-card">
              <div className="guide-prod-card__media">
                <img
                  src={displayImage}
                  alt={product.name}
                  className="guide-prod-card__image"
                  loading="lazy"
                />
                <span className="guide-prod-card__badge">Fresh Harvest</span>
              </div>

              <div className="guide-prod-card__content">
                <div className="guide-prod-card__header">
                  <h3 className="guide-prod-card__title">{product.name}</h3>
                  <span className="guide-prod-card__price">₹{product.price}</span>
                </div>

                <p className="guide-prod-card__desc">
                  {species ? species.shortDescription : (product.description || "Fresh gourmet mushrooms grown locally in Indore.")}
                </p>

                <div className="guide-prod-card__action">
                  <Link
                    to={`/product/${product._id}`}
                    className="guide-prod-card__cta"
                  >
                    View Product Details →
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default GuideProductConnection;
