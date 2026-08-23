import React, { useState } from "react";
import { HOMEPAGE_CONFIG } from "../../config/homepageConfig";
import { InfoModal } from "../ModalSystem/ModalSystem";
import "./FarmStory.css";

const STEP_POLICIES = {
  "Vertical Cultivation": {
    title: "Vertical Indoor Cultivation Standard",
    icon: "🌱",
    details: "All SHROOOMS gourmet cultivars are grown in Indore using vertical automated racks inside HEPA-filtered cleanrooms.",
    bullets: [
      "Zero chemical pesticides or artificial synthetic growth hormones",
      "99.97% HEPA air filtration protecting against wild spore contamination",
      "Sustainably sourced organic agricultural hardwood & bran substrate"
    ]
  },
  "Careful Selection": {
    title: "Harvest & Grading Quality Standard",
    icon: "🔬",
    details: "Each mushroom cluster is inspected at dawn by experienced mycologists prior to hand sorting.",
    bullets: [
      "Harvested precisely when cap margins reach optimal firmness",
      "Defect-free inspection for texture, density, and vibrant color",
      "Hand-trimmed stems ready for immediate culinary prep"
    ]
  },
  "Hygienic Packing": {
    title: "Ventilated Eco-Packaging Standard",
    icon: "📦",
    details: "Packed in breathable food-grade containers preserving structural shape and cap moisture.",
    bullets: [
      "Recyclable food-safe micro-ventilated packaging",
      "Keeps humidity balanced without moisture condensation pooling",
      "Protects delicate icicle tendrils and cap edges during transport"
    ]
  },
  "Direct Delivery": {
    title: "Indore Local Fresh Delivery Standard",
    icon: "🚚",
    details: "Dispatched direct from our Indore vertical farm to local restaurant kitchens and home gourmet buyers.",
    bullets: [
      "Same-day dawn harvest to kitchen delivery",
      "Cold-chain insulated shipping maintaining 4-8°C fresh state",
      "Guaranteed fresh shelf life up to 10 days"
    ]
  }
};

const FarmStory = () => {
  const { farmStory } = HOMEPAGE_CONFIG;
  const [activeInfoStep, setActiveInfoStep] = useState(null);

  return (
    <section className="farm-story-section home-section container-wide" aria-labelledby="story-title">
      <div className="story-container-grid">
        
        {/* Left: Organic Blob Visual with Spore Ring */}
        <div className="story-visual-side">
          <div className="organic-image-mask-wrapper">
            <div className="organic-spore-ring-glow" aria-hidden="true" />
            <img
              src="/shroooms_farm_story.png"
              alt="Controlled misting cycle inside automated Fruiting Chamber in Indore"
              className="story-organic-visual-img"
              loading="lazy"
              decoding="async"
            />
            <div className="visual-caption-tag">
              <span className="caption-dot" /> INDORE VERTICAL GROW CHAMBER
            </div>
          </div>
        </div>

        {/* Right: Copy & Process Markers with Info Buttons */}
        <div className="story-copy-side">
          <span className="story-eyebrow" id="story-title">Our Method</span>
          <h2 className="story-main-title">{farmStory.sectionTitle}</h2>
          <p className="story-intro-text">{farmStory.sectionSubtitle}</p>
          
          <div className="story-process-list" role="list">
            {farmStory.steps.map((step, index) => (
              <div className="story-process-item" key={index} role="listitem">
                <span className="story-step-number" aria-hidden="true">{step.number}</span>
                <div className="story-step-content">
                  <div className="step-title-row">
                    <h3 className="story-step-title">{step.title}</h3>
                    <button
                      className="info-trigger-btn"
                      onClick={() => setActiveInfoStep(step.title)}
                      aria-label={`View policy for ${step.title}`}
                      title="View details & policy"
                    >
                      i
                    </button>
                  </div>
                  <p className="story-step-desc">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Info Modal */}
      {activeInfoStep && STEP_POLICIES[activeInfoStep] && (
        <InfoModal
          isOpen={!!activeInfoStep}
          onClose={() => setActiveInfoStep(null)}
          title={STEP_POLICIES[activeInfoStep].title}
          icon={STEP_POLICIES[activeInfoStep].icon}
          details={STEP_POLICIES[activeInfoStep].details}
          bullets={STEP_POLICIES[activeInfoStep].bullets}
        />
      )}
    </section>
  );
};

export default FarmStory;
