import React from "react";
import { Link } from "react-router-dom";
import {
  MUSHROOM_GUIDE_CONFIG,
  MUSHROOM_GUIDE_DATA
} from "../../config/mushroomGuideConfig";
import { resolveProductForGuideItem } from "../../pages/MushroomGuide/mushroomGuideUtils";
import "./GuideFeaturedSpecies.css";

const GuideFeaturedSpecies = ({ products }) => {
  const featuredSlug = MUSHROOM_GUIDE_CONFIG.featuredSpeciesSlug;
  const item = MUSHROOM_GUIDE_DATA.find((sp) => sp.slug === featuredSlug);

  if (!item) {
    return null;
  }

  const resolvedProduct = resolveProductForGuideItem(item, products);

  return (
    <section className="guide-featured-section" aria-label="Featured Species Spotlight">
      <div className="guide-featured">
        <div className="guide-featured__media">
          <img
            src={item.image}
            alt={item.imageAlt}
            className="guide-featured__image"
            loading="lazy"
          />
          <span className="guide-featured__badge">Species Spotlight</span>
        </div>

        <div className="guide-featured__content">
          <span className="guide-featured__eyebrow">
            {item.categoryLabel} Spotlight
          </span>
          <h2 className="guide-featured__title">{item.commonName}</h2>
          {item.scientificName && (
            <span className="guide-featured__scientific">
              {item.scientificName}
            </span>
          )}

          <p className="guide-featured__desc">{item.shortDescription}</p>

          <dl className="guide-featured__specs">
            <div className="guide-featured__spec-item">
              <dt className="guide-featured__spec-label">Flavor Profile</dt>
              <dd className="guide-featured__spec-value">{item.flavor}</dd>
            </div>
            <div className="guide-featured__spec-item">
              <dt className="guide-featured__spec-label">Texture</dt>
              <dd className="guide-featured__spec-value">{item.texture}</dd>
            </div>
            <div className="guide-featured__spec-item">
              <dt className="guide-featured__spec-label">Best Cooking Methods</dt>
              <dd className="guide-featured__spec-value">{item.bestFor}</dd>
            </div>
          </dl>

          {resolvedProduct && (
            <div className="guide-featured__action">
              <Link
                to={`/product/${resolvedProduct._id}`}
                className="guide-featured__cta"
              >
                View {item.commonName} Product →
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default GuideFeaturedSpecies;
