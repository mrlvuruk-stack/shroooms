import React, { useEffect, useCallback } from "react";
import "./ModalSystem.css";

// ── Base Modal Component ──
export const BaseModal = ({
  isOpen,
  onClose,
  title,
  children,
  className = "",
  size = "medium" // 'small' | 'medium' | 'large'
}) => {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape" && isOpen && onClose) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="shroooms-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={`shroooms-modal-container modal-size-${size} ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          {title && <h3 id="modal-title" className="modal-title">{title}</h3>}
          <button
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
};

// ── Informational Modal Component ──
export const InfoModal = ({ isOpen, onClose, title, icon = "ℹ️", details, bullets = [] }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title={title} className="shroooms-info-modal" size="medium">
      <div className="info-modal-badge">{icon} Policy & Details</div>
      <div className="info-modal-content">
        <p className="info-modal-desc">{details}</p>
        {bullets && bullets.length > 0 && (
          <ul className="info-modal-bullets">
            {bullets.map((item, idx) => (
              <li key={idx}>
                <span className="bullet-dot">🌿</span> {item}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="info-modal-actions">
        <button className="btn-primary info-modal-close" onClick={onClose}>
          Got it, thanks!
        </button>
      </div>
    </BaseModal>
  );
};

// ── Promotional Modal Component ──
export const PromotionalModal = ({ isOpen, onClose, promoCode = "SHROOOMS20", discount = "20% OFF", description }) => {
  return (
    <BaseModal isOpen={isOpen} onClose={onClose} className="shroooms-promo-modal" size="medium">
      <div className="promo-modal-header-bg">
        <span className="promo-sparkle">✨ SPECIAL HARVEST OFFER ✨</span>
        <h2 className="promo-discount-title">{discount}</h2>
        <p className="promo-tagline">On Fresh Gourmet Cultivars & Grow Kits</p>
      </div>

      <div className="promo-modal-content">
        <p className="promo-desc">
          {description || "Use coupon code at checkout to claim your gourmet mushroom harvest discount today!"}
        </p>

        <div className="promo-code-card">
          <span className="promo-code-label">PROMO CODE:</span>
          <strong className="promo-code-value">{promoCode}</strong>
          <button
            className="promo-copy-btn"
            onClick={() => {
              navigator.clipboard?.writeText(promoCode);
              alert(`Code ${promoCode} copied to clipboard!`);
            }}
          >
            Copy Code
          </button>
        </div>
      </div>

      <div className="promo-modal-actions">
        <button className="btn-primary promo-claim-btn" onClick={onClose}>
          Claim Discount Now →
        </button>
      </div>
    </BaseModal>
  );
};

// ── Toast Notification Component ──
export const Toast = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      if (onClose) onClose();
    }, 3200);
    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className={`shroooms-toast-notification toast-type-${type}`} role="alert">
      <span className="toast-icon">
        {type === "success" ? "🛒" : type === "promo" ? "🎉" : "ℹ️"}
      </span>
      <span className="toast-message">{message}</span>
      {onClose && (
        <button className="toast-dismiss" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};
