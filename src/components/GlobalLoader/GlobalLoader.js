import React, { useState, useEffect } from "react";
import "./GlobalLoader.css";

const CRITICAL_ASSETS = [
  "/banner_nourish.jpg",
  "/banner_boxes.jpg",
  "/banner_pouches.jpg",
  "/box_lions_mane.jpg",
  "/box_blue_oyster.jpg",
  "/box_pink_oyster.jpg"
];

const GlobalLoader = ({ children }) => {
  const [isReady, setIsReady] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Respect user prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsReady(true);
      return;
    }

    let loadedCount = 0;
    const totalAssets = CRITICAL_ASSETS.length + 1; // +1 for DOM complete

    const updateProgress = () => {
      loadedCount++;
      const currentPct = Math.min(Math.round((loadedCount / totalAssets) * 100), 100);
      setProgress(currentPct);

      if (loadedCount >= totalAssets) {
        finishLoading();
      }
    };

    const finishLoading = () => {
      setProgress(100);
      setTimeout(() => {
        setFadeOut(true);
        setTimeout(() => {
          setIsReady(true);
        }, 500);
      }, 300);
    };

    // Safety timeout cap (3.5s maximum) to guarantee site reveals if network hangs
    const safetyCap = setTimeout(() => {
      finishLoading();
    }, 3500);

    // Track DOM readiness
    if (document.readyState === "complete") {
      updateProgress();
    } else {
      window.addEventListener("load", updateProgress, { once: true });
    }

    // Preload critical images
    CRITICAL_ASSETS.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = updateProgress;
      img.onerror = updateProgress; // Graceful fallback on load error
    });

    return () => {
      clearTimeout(safetyCap);
    };
  }, []);

  return (
    <>
      {!isReady && (
        <div className={`shroooms-global-loader ${fadeOut ? "fade-out" : ""}`} role="status" aria-live="polite">
          <div className="loader-backdrop-glow" />
          
          <div className="loader-content-card">
            {/* Branded Spore Emblem SVG */}
            <div className="shroooms-loader-icon">
              <svg width="70" height="70" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="44" stroke="url(#goldGrad)" strokeWidth="3" strokeDasharray="6 6" className="loader-ring-spin" />
                <path d="M25,65 C25,35 75,35 75,65 Z" fill="url(#emeraldGrad)" />
                <path d="M44,65 L44,80 M56,65 L56,80" stroke="#d4af37" strokeWidth="4" strokeLinecap="round" />
                <circle cx="40" cy="48" r="3" fill="#ffffff" opacity="0.8" />
                <circle cx="60" cy="52" r="4" fill="#ffffff" opacity="0.8" />
                <circle cx="50" cy="42" r="3" fill="#ffffff" opacity="0.8" />
                <defs>
                  <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#c5a059" />
                  </linearGradient>
                  <linearGradient id="emeraldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#267a3f" />
                    <stop offset="100%" stopColor="#1b2e23" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <h1 className="loader-brand-title">SHROOOMS</h1>
            <p className="loader-subtitle">Cultivating Culinary & Medicinal Excellence</p>

            <div className="loader-progress-bar-container">
              <div className="loader-progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>

            <span className="loader-status-text">Readying Strains & Layout... {progress}%</span>
          </div>
        </div>
      )}

      {/* Main UI stays hidden/ready until asset preloading completes */}
      <div className={`shroooms-app-content ${isReady ? "content-visible" : "content-hidden"}`}>
        {children}
      </div>
    </>
  );
};

export default GlobalLoader;
