import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RECIPES_DATA } from "../../pages/Recipes/Recipes";
import { InfoModal } from "../ModalSystem/ModalSystem";
import "./RecipesEducation.css";

const RecipesEducation = () => {
  const items = RECIPES_DATA;
  const [activeRecipeInfo, setActiveRecipeInfo] = useState(null);

  const getRecipeImage = (id) => {
    switch (id) {
      case "lions-mane-steaks":
        return "/banner_nourish.jpg";
      case "king-oyster-scallops":
        return "/banner_boxes.jpg";
      case "pink-oyster-tacos":
        return "/banner_pouches.jpg";
      case "blue-oyster-stir-fry":
        return "/box_blue_oyster.jpg";
      default:
        return "/banner_doorstep.jpg";
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section className="recipes-edu-section home-section container-wide" aria-labelledby="recipes-title">
      <div className="recipes-header">
        <span className="recipes-eyebrow" id="recipes-title">Kitchen Guides</span>
        <h2 className="recipes-main-heading">Culinary Inspiration Carousel</h2>
        <p className="recipes-intro">Swipe through simple gourmet preparation techniques crafted for gourmet cultivars.</p>
      </div>

      {/* Horizontal Carousel Viewport */}
      <div className="recipes-carousel-viewport">
        <div className="recipes-carousel-track">
          {items.map((item) => (
            <div className="recipe-carousel-card" key={item.id}>
              {/* Circular Organic Image Container */}
              <div className="recipe-circle-img-container">
                <img
                  src={getRecipeImage(item.id)}
                  alt={item.name}
                  className="recipe-circle-img"
                  loading="lazy"
                  decoding="async"
                />
                <span className="recipe-badge-tag">{item.difficulty}</span>
                <button
                  className="recipe-info-float-btn"
                  onClick={() => setActiveRecipeInfo(item)}
                  aria-label={`View details for ${item.name}`}
                  title="View Culinary Policy & Recipe Info"
                >
                  i
                </button>
              </div>

              {/* Text Description Area below visual */}
              <div className="recipe-card-content">
                <span className="recipe-meta-text">⏱ {item.time} · {item.mushroom}</span>
                <h3 className="recipe-card-title">{item.name}</h3>
                <p className="recipe-card-desc">{item.summary}</p>
                <div className="recipe-card-actions">
                  <Link to={`/recipes`} className="btn-secondary recipe-view-btn">
                    View Recipe →
                  </Link>
                  <button
                    className="info-trigger-btn"
                    onClick={() => setActiveRecipeInfo(item)}
                    aria-label={`More info about ${item.name}`}
                    title="Recipe Policy & Nutritional Info"
                  >
                    i
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recipes-footer-action">
        <Link to="/recipes" className="btn-primary recipes-all-btn">
          Explore Complete Culinary Guide <span className="btn-arrow" aria-hidden="true">→</span>
        </Link>
      </div>

      {/* Culinary Recipe Info Modal */}
      {activeRecipeInfo && (
        <InfoModal
          isOpen={!!activeRecipeInfo}
          onClose={() => setActiveRecipeInfo(null)}
          title={`${activeRecipeInfo.name} — Culinary Guide`}
          icon="🍳"
          details={activeRecipeInfo.summary || "Gourmet preparation guide for SHROOOMS fresh cultivars."}
          bullets={[
            `Preparation Time: ${activeRecipeInfo.time}`,
            `Recommended Cultivar: ${activeRecipeInfo.mushroom}`,
            `Difficulty Rating: ${activeRecipeInfo.difficulty}`,
            "Pro Chef Tip: Pan-sear mushrooms in high heat dry pan first before adding butter & garlic for maximum golden crispiness!"
          ]}
        />
      )}
    </section>
  );
};

export default RecipesEducation;
