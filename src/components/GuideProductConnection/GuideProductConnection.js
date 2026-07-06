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

      <div className="guide-products-list">
        {items.map(({ product, species }) => {
          // Explicitly use claim-free raw species image for product display
          const displayImage = species && species.image ? species.image : (product.image || "/shrooom.jpg");

          return (
            <article key={product._id} className="guide-prod-row">
              <div className="guide-prod-row__media">
                <img
                  src={displayImage}
                  alt={product.name}
                  className="guide-prod-row__image"
                  loading="lazy"
                />
              </div>

              <div className="guide-prod-row__info">
                <h3 className="guide-prod-row__title">{product.name}</h3>
                <span className="guide-prod-row__unit">Fresh Harvest • 200g</span>
              </div>

              <div className="guide-prod-row__price-tag">
                <span className="guide-prod-row__price">₹{product.price}</span>
              </div>

              <div className="guide-prod-row__action">
                <Link
                  to={`/product/${product._id}`}
                  className="guide-prod-row__cta"
                >
                  View Product →
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default GuideProductConnection;
