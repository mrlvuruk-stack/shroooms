import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { filteredProducts } from "../../store/actions/actionCreators/productsListAction";
import { CANONICAL_CATEGORIES } from "../../config/categoryConfig";
import "./CategoryGrid.css";

const CATEGORY_IMAGES = {
  "All": "/banner_nourish.jpg",
  "Sponges": "/banner_nourish.jpg",
  "Accessories": "/box_blue_oyster.jpg",
  "Liquid Culture": "/box_lions_mane.jpg",
  "Fresh Mushrooms": "/box_pink_oyster.jpg",
  "Dried Mushrooms": "/cultivar_chaga.jpg",
  "Spawn": "/box_king_oyster.jpg",
  "Tools & Accessories": "/banner_pouches.jpg"
};

const CategoryGrid = ({ selectedCategory, onSelectCategory }) => {
  const dispatch = useDispatch();
  const vegetables = useSelector((state) => state.products.vegetables) || [];

  const handleCategoryClick = (catName) => {
    if (onSelectCategory) {
      onSelectCategory(catName);
    } else {
      dispatch(filteredProducts(catName === "All" ? "" : catName));
    }
    const target = document.getElementById("produce-list");
    if (target) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    }
  };

  return (
    <section className="category-section home-section container-wide" aria-labelledby="category-title">
      <div className="category-header">
        <span className="category-eyebrow" id="category-title">Shop by Category</span>
        <h2 className="category-title">Explore Our Strict Curation</h2>
      </div>

      <div className="category-grid">
        {CANONICAL_CATEGORIES.map((cat) => {
          const isActive = selectedCategory && selectedCategory.toLowerCase() === cat.name.toLowerCase();
          const count = cat.name === "All" 
            ? vegetables.length 
            : vegetables.filter(v => v.category && v.category.toLowerCase() === cat.name.toLowerCase()).length;

          return (
            <button
              key={cat.id}
              className={`category-card ${isActive ? "active-category-card" : ""}`}
              onClick={() => handleCategoryClick(cat.name)}
              aria-label={`View category: ${cat.name}`}
            >
              <div className="category-image-wrapper">
                <img
                  src={CATEGORY_IMAGES[cat.name] || "/banner_nourish.jpg"}
                  alt={cat.name}
                  className="category-image"
                  loading="lazy"
                  decoding="async"
                  style={{ aspectRatio: "4 / 3" }}
                />
                <div className="category-overlay" />
                <span className="category-badge-chip">{cat.icon} {count} Items</span>
              </div>
              
              <div className="category-info">
                <h3 className="category-card-name">{cat.name}</h3>
                <p className="category-card-desc">{cat.description}</p>
                <span className="category-card-link" aria-hidden="true">
                  Select Category <span className="arrow-inline">→</span>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryGrid;

