import React, { useState, useEffect, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { HOMEPAGE_CONFIG } from "../../config/homepageConfig";
import "./Hero.css";

const Hero3D = lazy(() => import("../Hero3D/Hero3D"));

const Hero = () => {
  const { hero } = HOMEPAGE_CONFIG;
  const [activeBox, setActiveBox] = useState(0);
  const [show3D, setShow3D] = useState(false);
  const [canvasReady, setCanvasReady] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBox((prev) => (prev + 1) % hero.fallbackImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [hero.fallbackImages.length]);

  useEffect(() => {
    // 1. Device capability check
    const isEligible = () => {
      try {
        const canvas = document.createElement("canvas");
        const hasWebGL = !!(
          window.WebGLRenderingContext &&
          (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
        );
        const isDesktop = window.innerWidth >= 1024;
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        return isDesktop && !prefersReduced && hasWebGL;
      } catch (e) {
        return false;
      }
    };

    if (isEligible()) {
      // 2. Defer loading until browser is idle
      const deferLoad = () => {
        if (window.requestIdleCallback) {
          window.requestIdleCallback(() => setShow3D(true));
        } else {
          setTimeout(() => setShow3D(true), 1200);
        }
      };

      if (document.readyState === "complete") {
        deferLoad();
      } else {
        window.addEventListener("load", deferLoad);
        return () => window.removeEventListener("load", deferLoad);
      }
    }
  }, []);

  return (
    <section className="home-hero home-section" aria-label="Welcome banner">
      {/* Visual Placeholder for future 3D centerpiece scene */}
      <div className="hero-3d-wrapper" aria-hidden="true" />

      {/* Left Text content */}
      <div className="hero-left">
        <div className="hero-top-strip">
          <div className="hero-strip-line" />
          <span className="grown-care-tag">
            {hero.badgeText} <span className="heart-icon" aria-hidden="true">♡</span>
          </span>
        </div>

        <h1 className="hero-title">
          {hero.titleLine1}<br />
          {hero.titleLine2}<br />
          <span className="cursive-title">{hero.titleCursive}</span>
        </h1>

        <p className="hero-subtitle">
          {hero.subtitle}
        </p>

        <div className="hero-cta">
          <a href={hero.primaryCtaAnchor} className="btn-primary">
            {hero.primaryCtaText} <span className="btn-arrow" aria-hidden="true">↗</span>
          </a>
          <Link to={hero.secondaryCtaRoute} className="btn-secondary">
            {hero.secondaryCtaText} <span className="btn-arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </div>

      {/* Right visual slide deck (Fallback visuals / 3D Canvas) */}
      <div className="hero-right">
        <div className="hero-box-showcase">
          {/* Deferred 3D Canvas overlay */}
          {show3D && (
            <Suspense fallback={null}>
              <Hero3D onReady={() => setCanvasReady(true)} />
            </Suspense>
          )}

          <div className="box-glow" aria-hidden="true" />
          
          {hero.fallbackImages.map((img, i) => (
            <img
              key={img.src}
              src={img.src}
              alt={img.alt}
              className={`hero-box-img ${i === activeBox ? "active" : ""} ${canvasReady ? "hide-for-3d" : ""}`}
              loading={i === 0 ? "eager" : "lazy"}
              decoding={i === 0 ? "sync" : "async"}
              style={{ aspectRatio: "4 / 3" }}
            />
          ))}
          
          <div className={`box-dots ${canvasReady ? "hide-for-3d" : ""}`} role="tablist" aria-label="Slideshow controls">
            {hero.fallbackImages.map((img, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === activeBox}
                aria-label={`Slide ${i + 1}`}
                className={`box-dot ${i === activeBox ? "active" : ""}`}
                onClick={() => setActiveBox(i)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
