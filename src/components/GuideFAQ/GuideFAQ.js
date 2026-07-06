import React, { useState } from "react";
import { MUSHROOM_GUIDE_FAQS } from "../../config/mushroomGuideConfig";
import "./GuideFAQ.css";

const GuideFAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="guide-faq-section" aria-label="Mushroom Guide FAQ">
      <div className="guide-faq-header">
        <span className="guide-faq-eyebrow">Frequently Asked Questions</span>
        <h2 className="guide-faq-title">Guide FAQ</h2>
        <p className="guide-faq-subtitle">
          Factual answers to common culinary, selection, and storage questions.
        </p>
      </div>

      <div className="guide-faq-list">
        {MUSHROOM_GUIDE_FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div key={faq.id} className={`guide-faq-item ${isOpen ? "guide-faq-item--open" : ""}`}>
              <button
                type="button"
                className="guide-faq-button"
                onClick={() => toggleFAQ(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${idx}`}
                id={`faq-header-${idx}`}
              >
                <span className="guide-faq-question">{faq.question}</span>
                <span className="guide-faq-icon" aria-hidden="true">
                  {isOpen ? "−" : "+"}
                </span>
              </button>

              <div
                id={`faq-answer-${idx}`}
                className="guide-faq-answer-wrapper"
                role="region"
                aria-labelledby={`faq-header-${idx}`}
                hidden={!isOpen}
              >
                <p className="guide-faq-answer">{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default GuideFAQ;
