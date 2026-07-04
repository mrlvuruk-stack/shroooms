import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { filteredProducts } from "../../store/actions/actionCreators/productsListAction";
import { HOMEPAGE_CONFIG } from "../../config/homepageConfig";
import "./CategoryGrid.css";

const CategoryGrid = () => {
  const dispatch = useDispatch();
  const vegetables = useSelector((state) => state.products.vegetables) || [];
  
  const handleCategoryClick = (keyword) => {
    dispatch(filteredProducts(keyword));
    const target = document.getElementById("produce-list");
    if (target) {
      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
    }
  };

  // Filter categories to only render those that have at least one matching product in the catalog
  const activeCategories = HOMEPAGE_CONFIG.categories.filter((cat) => {
    // If keyword is empty, it matches all products. So if there's at least 1 product, render it.
    if (cat.keyword === "") {
      return vegetables.length > 0;
    }
    
    // Check if any product has the keyword in its name or description
    return vegetables.some((veg) => {
      const nameMatch = veg.name?.toLowerCase().includes(cat.keyword);
      const descMatch = veg.description?.toLowerCase().includes(cat.keyword);
      return nameMatch || descMatch;
    });
  });

  if (activeCategories.length === 0) {
    return null; // Return null if no matching categories are available
  }

  return (
    <section className="category-section home-section container-wide" aria-labelledby="category-title">
      <div className="category-header">
        <span className="category-eyebrow" id="category-title">Shop by Category</span>
        <h2 className="category-title">Explore Our Curation</h2>
      </div>

      <div className="category-grid">
        {activeCategories.map((cat) => (
          <button
            key={cat.id}
            className="category-card"
            onClick={() => handleCategoryClick(cat.keyword)}
            aria-label={`View category: ${cat.name}`}
          >
            <div className="category-image-wrapper">
              <img
                src={cat.image}
                alt=""
                className="category-image"
                loading="lazy"
                decoding="async"
                style={{ aspectRatio: "4 / 3" }}
              />
              <div className="category-overlay" />
            </div>
            
            <div className="category-info">
              <h3 className="category-card-name">{cat.name}</h3>
              <p className="category-card-desc">{cat.description}</p>
              <span className="category-card-link" aria-hidden="true">
                Discover Collection <span className="arrow-inline">→</span>
              </span>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryGrid;
