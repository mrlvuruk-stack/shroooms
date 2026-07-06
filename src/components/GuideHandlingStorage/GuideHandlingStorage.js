import React from "react";
import "./GuideHandlingStorage.css";

const HANDLING_STEPS = [
  {
    number: "01",
    title: "Keep Cool",
    summary: "Refrigerate promptly upon arrival",
    detail: "Store fresh mushrooms refrigerated in a cool environment and avoid unnecessary exposure to heat."
  },
  {
    number: "02",
    title: "Allow Airflow",
    summary: "Use breathable containers",
    detail: "Use breathable paper bags or containers with slight ventilation rather than sealing fresh mushrooms tightly in moisture-trapping plastic."
  },
  {
    number: "03",
    title: "Manage Moisture",
    summary: "Keep dry until preparation",
    detail: "Keep mushrooms dry during storage. Brush clean or wipe gently with a damp cloth shortly before cooking rather than washing in advance."
  },
  {
    number: "04",
    title: "Inspect Before Use",
    summary: "Check condition prior to cooking",
    detail: "Inspect mushrooms before cooking and discard any clusters exhibiting clear signs of spoilage, slime, or unacceptable deterioration."
  }
];

const GuideHandlingStorage = () => {
  return (
    <section className="guide-storage-section" aria-label="Handling & Storage Guide">
      <div className="guide-storage-header">
        <span className="guide-storage-eyebrow">Care Principles</span>
        <h2 className="guide-storage-title">Handling & Storage Guide</h2>
        <p className="guide-storage-subtitle">
          Essential care principles to preserve natural texture, aroma, and culinary quality before cooking.
        </p>
      </div>

      <div className="guide-storage-grid">
        {HANDLING_STEPS.map((step) => (
          <article key={step.number} className="guide-storage-card">
            <span className="guide-storage-card__number">{step.number}</span>
            <div className="guide-storage-card__body">
              <h3 className="guide-storage-card__title">{step.title}</h3>
              <span className="guide-storage-card__summary">{step.summary}</span>
              <p className="guide-storage-card__detail">{step.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default GuideHandlingStorage;
