import React from "react";
import { HOMEPAGE_CONFIG } from "../../config/homepageConfig";
import "./FarmStory.css";

const FarmStory = () => {
  const { farmStory } = HOMEPAGE_CONFIG;

  return (
    <section className="farm-story-section home-section container-wide" aria-labelledby="story-title">
      <div className="story-container-grid">
        
        {/* Left: Large Visual (55-65% width) */}
        <div className="story-visual-side">
          <img
            src="/shroooms_farm_story.png"
            alt="Controlled misting cycle inside automated Fruiting Chamber in Indore"
            className="story-large-visual-img"
            loading="lazy"
            decoding="async"
            style={{ aspectRatio: "16 / 10" }}
          />
        </div>

        {/* Right: Copy & Process Markers */}
        <div className="story-copy-side">
          <span className="story-eyebrow" id="story-title">Our Method</span>
          <h2 className="story-main-title">{farmStory.sectionTitle}</h2>
          <p className="story-intro-text">{farmStory.sectionSubtitle}</p>
          
          <div className="story-process-list" role="list">
            {farmStory.steps.map((step, index) => (
              <div className="story-process-item" key={index} role="listitem">
                <span className="story-step-number" aria-hidden="true">{step.number}</span>
                <div className="story-step-content">
                  <h3 className="story-step-title">{step.title}</h3>
                  <p className="story-step-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default FarmStory;
