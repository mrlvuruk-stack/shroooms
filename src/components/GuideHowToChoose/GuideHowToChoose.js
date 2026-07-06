import React from "react";
import {
  MUSHROOM_GUIDE_CHOICE_GROUPS,
  MUSHROOM_GUIDE_DATA
} from "../../config/mushroomGuideConfig";
import "./GuideHowToChoose.css";

const GuideHowToChoose = () => {
  return (
    <section className="guide-choose-section" aria-label="How to Choose Your Mushrooms">
      <div className="guide-choose-header">
        <span className="guide-choose-eyebrow">Culinary Decision Guide</span>
        <h2 className="guide-choose-title">How to Choose Your Mushrooms</h2>
        <p className="guide-choose-subtitle">
          Select the ideal variety based on texture, flavor profile, and intended culinary technique.
        </p>
      </div>

      <div className="guide-choose-grid">
        {MUSHROOM_GUIDE_CHOICE_GROUPS.map((group) => {
          // Derive species for this group dynamically from MUSHROOM_GUIDE_DATA (max 3)
          const matchingSpecies = MUSHROOM_GUIDE_DATA.filter(
            (sp) => sp.choiceGroup === group.id
          ).slice(0, 3);

          if (matchingSpecies.length === 0) {
            return null;
          }

          return (
            <article key={group.id} className="guide-choose-card">
              <h3 className="guide-choose-card__title">{group.title}</h3>
              <p className="guide-choose-card__desc">{group.description}</p>

              <div className="guide-choose-card__species-list">
                <span className="guide-choose-card__species-label">Recommended Varieties:</span>
                <ul className="guide-choose-card__items">
                  {matchingSpecies.map((sp) => (
                    <li key={sp.id} className="guide-choose-card__item">
                      <a
                        href={`#guide-species-${sp.slug}`}
                        className="guide-choose-card__link"
                      >
                        <span className="guide-choose-card__name">{sp.commonName}</span>
                        {sp.scientificName && (
                          <span className="guide-choose-card__scientific">({sp.scientificName})</span>
                        )}
                      </a>
                      <span className="guide-choose-card__reason">
                        {sp.flavor.split(",")[0]} • {sp.bestFor.split(",")[0]}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default GuideHowToChoose;
