import React from "react";
import { Link } from "react-router-dom";
import { RECIPES_DATA } from "../../pages/Recipes/Recipes";
import "./RecipesEducation.css";

const RecipesEducation = () => {
  // Use maximum 3 recipes
  const items = RECIPES_DATA.slice(0, 3);

  // Map recipe ID to verified public assets for visual representation
  const getRecipeImage = (id) => {
    switch (id) {
      case "lions-mane-steaks":
        return "/banner_nourish.jpg";
      case "king-oyster-scallops":
        return "/banner_boxes.jpg";
      case "pink-oyster-tacos":
        return "/banner_pouches.jpg";
      default:
        return "/banner_doorstep.jpg";
    }
  };

  const getRecipeAlt = (id) => {
    switch (id) {
      case "lions-mane-steaks":
        return "Gourmet mushrooms growing inside clean chambers";
      case "king-oyster-scallops":
        return "Packed mushroom crates on shelves";
      case "pink-oyster-tacos":
        return "Sealed gourmet products packaging";
      default:
        return "Mushrooms inside a delivery basket";
    }
  };

  if (!items || items.length === 0) return null;

  const leadItem = items[0];
  const secondaryItems = items.slice(1);

  return (
    <section className="recipes-edu-section home-section container-wide" aria-labelledby="recipes-title">
      <div className="recipes-header">
        <span className="recipes-eyebrow" id="recipes-title">Kitchen Guides</span>
        <h2 className="recipes-main-heading">Culinary Inspiration</h2>
        <p className="recipes-intro">Explore simple preparation methods and recipes utilizing our gourmet cultivars.</p>
      </div>

      <div className="recipes-asymmetric-layout">
        {/* Left Column: Asymmetric Lead Card */}
        <div className="recipes-lead-column">
          <div className="recipe-lead-card">
            <div className="recipe-lead-img-wrapper">
              <img
                src={getRecipeImage(leadItem.id)}
                alt={getRecipeAlt(leadItem.id)}
                className="recipe-lead-img"
                loading="lazy"
                decoding="async"
                style={{ aspectRatio: "16 / 10" }}
              />
              <span className="recipe-lead-badge">{leadItem.difficulty}</span>
            </div>
            <div className="recipe-lead-content">
              <span className="recipe-meta-text">{leadItem.time} · {leadItem.mushroom}</span>
              <h3 className="recipe-lead-title">{leadItem.name}</h3>
              <p className="recipe-lead-summary">{leadItem.summary}</p>
              <Link to="/recipes" className="btn-text recipe-lead-link">
                View Preparation Steps <span className="arrow-inline">→</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column: Secondary Cards stacked */}
        <div className="recipes-secondary-column">
          {secondaryItems.map((item) => (
            <div className="recipe-row-card" key={item.id}>
              <div className="recipe-row-img-wrapper">
                <img
                  src={getRecipeImage(item.id)}
                  alt={getRecipeAlt(item.id)}
                  className="recipe-row-img"
                  loading="lazy"
                  decoding="async"
                  style={{ aspectRatio: "4 / 3" }}
                />
              </div>
              <div className="recipe-row-content">
                <span className="recipe-meta-text">{item.time} · {item.mushroom}</span>
                <h3 className="recipe-row-title">{item.name}</h3>
                <p className="recipe-row-summary">{item.summary}</p>
                <Link to="/recipes" className="btn-text recipe-row-link">
                  Details <span className="arrow-inline">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="recipes-footer-action">
        <Link to="/recipes" className="btn-primary recipes-all-btn">
          Explore All Recipes <span className="btn-arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
};

export default RecipesEducation;
