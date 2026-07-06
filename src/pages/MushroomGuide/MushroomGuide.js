import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import vegetablesList from "../../store/actions/actionCreators/productsListAction";
import {
  MUSHROOM_GUIDE_DATA,
  MUSHROOM_GUIDE_CATEGORIES
} from "../../config/mushroomGuideConfig";
import { resolveProductForGuideItem } from "./mushroomGuideUtils";
import GuideFeaturedSpecies from "../../components/GuideFeaturedSpecies/GuideFeaturedSpecies";
import GuideHowToChoose from "../../components/GuideHowToChoose/GuideHowToChoose";
import GuideHandlingStorage from "../../components/GuideHandlingStorage/GuideHandlingStorage";
import "./MushroomGuide.css";

const MushroomGuide = () => {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState("all");

  const productsData = useSelector((state) => state.products);
  const { vegetables: products } = productsData || {};

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(vegetablesList());
    }
  }, [dispatch, products]);

  useEffect(() => {
    document.title = "Mushroom Guide — Varieties & Culinary Uses | SHROOOMS";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Explore gourmet mushroom varieties, culinary flavor profiles, textures, best cooking methods, decision guides, and handling advice."
      );
    }
    window.scrollTo(0, 0);
  }, []);

  const filteredItems =
    activeCategory === "all"
      ? MUSHROOM_GUIDE_DATA
      : MUSHROOM_GUIDE_DATA.filter((item) => item.category === activeCategory);

  return (
    <main className="mushroom-guide">

      {/* ═══ 1. GUIDE HERO ═══ */}
      <section className="guide-hero" aria-label="Mushroom Guide Introduction">
        <div className="guide-hero__content">
          <span className="guide-hero__eyebrow">SHROOOMS Field Guide</span>
          <h1 className="guide-hero__title">
            Know What You're Growing.<br />
            Know What You're Cooking.
          </h1>
          <p className="guide-hero__subtitle">
            Explore mushroom varieties through culinary characteristics, textures,
            common uses, and available SHROOOMS products.
          </p>
        </div>
        <div className="guide-hero__visual">
          <img
            src="/shroooms_farm_story.png"
            alt="SHROOOMS indoor controlled-environment vertical mushroom cultivation facility"
            className="guide-hero__image"
            fetchPriority="high"
          />
        </div>
      </section>

      {/* ─── divider ─── */}
      <div className="guide-divider"><div className="guide-divider__line" /></div>

      {/* ═══ 2 & 3. CATEGORY FILTERS & SPECIES DISCOVERY GRID ═══ */}
      <section className="guide-section" aria-label="Mushroom Species Discovery">
        <div className="guide-filter-bar">
          <div className="guide-filter-chips" role="group" aria-label="Filter varieties by type">
            {MUSHROOM_GUIDE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`guide-chip ${activeCategory === cat.id ? "guide-chip--active" : ""}`}
                onClick={() => setActiveCategory(cat.id)}
                aria-pressed={activeCategory === cat.id}
              >
                {cat.label}
              </button>
            ))}
          </div>
          <span className="guide-filter-count" aria-live="polite">
            {filteredItems.length} {filteredItems.length === 1 ? "variety" : "varieties"} shown
          </span>
        </div>

        {/* ═══ SPECIES DISCOVERY GRID ═══ */}
        <div className="guide-grid">
          {filteredItems.map((item) => {
            const resolvedProduct = resolveProductForGuideItem(item, products);

            return (
              <article
                key={item.id}
                id={`guide-species-${item.slug}`}
                className="guide-card"
              >
                <div className="guide-card__media">
                  <img
                    src={item.image}
                    alt={item.imageAlt}
                    className="guide-card__image"
                    loading="lazy"
                  />
                  <span className="guide-card__category-badge">{item.categoryLabel}</span>
                </div>
                <div className="guide-card__content">
                  <div className="guide-card__header">
                    <h3 className="guide-card__title">{item.commonName}</h3>
                    {item.scientificName && (
                      <span className="guide-card__scientific">{item.scientificName}</span>
                    )}
                  </div>

                  <p className="guide-card__desc">{item.shortDescription}</p>

                  <dl className="guide-card__meta">
                    <div className="guide-card__meta-row">
                      <dt className="guide-card__meta-label">Flavor:</dt>
                      <dd className="guide-card__meta-value">{item.flavor}</dd>
                    </div>
                    <div className="guide-card__meta-row">
                      <dt className="guide-card__meta-label">Texture:</dt>
                      <dd className="guide-card__meta-value">{item.texture}</dd>
                    </div>
                    <div className="guide-card__meta-row">
                      <dt className="guide-card__meta-label">Best For:</dt>
                      <dd className="guide-card__meta-value">{item.bestFor}</dd>
                    </div>
                  </dl>

                  {resolvedProduct && (
                    <div className="guide-card__action">
                      <Link
                        to={`/product/${resolvedProduct._id}`}
                        className="guide-card__cta"
                      >
                        View Product →
                      </Link>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ─── divider ─── */}
      <div className="guide-divider"><div className="guide-divider__line" /></div>

      {/* ═══ 4. FEATURED SPECIES EDITORIAL SPOTLIGHT ═══ */}
      <GuideFeaturedSpecies products={products} />

      {/* ─── divider ─── */}
      <div className="guide-divider"><div className="guide-divider__line" /></div>

      {/* ═══ 5. HOW TO CHOOSE ═══ */}
      <GuideHowToChoose />

      {/* ─── divider ─── */}
      <div className="guide-divider"><div className="guide-divider__line" /></div>

      {/* ═══ 6. HANDLING & STORAGE ═══ */}
      <GuideHandlingStorage />

    </main>
  );
};

export default MushroomGuide;
