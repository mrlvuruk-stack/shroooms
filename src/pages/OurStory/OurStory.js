import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import "./OurStory.css";

const OurStory = () => {
  useEffect(() => {
    document.title = "Our Story | SHROOOMS";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Learn what SHROOOMS is building around mushroom product discovery, recipes, grow-at-home offerings, and wholesale access."
      );
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <main className="ourstory">

      {/* ═══ 1. STORY HERO ═══ */}
      <header className="ourstory-hero">
        <div className="ourstory-hero__content">
          <span className="ourstory-hero__eyebrow">The SHROOOMS Story</span>
          <h1 className="ourstory-hero__title">
            More Than Mushrooms.
          </h1>
          <p className="ourstory-hero__subtitle">
            SHROOOMS is building a focused place to discover gourmet mushrooms,
            explore mushroom products, learn practical ways to use them, and
            access grow-at-home offerings.
          </p>
        </div>
        <div className="ourstory-hero__visual">
          <img
            src="/shroooms_product_showcase.png"
            alt="SHROOOMS gourmet mushroom product collection"
            className="ourstory-hero__image"
          />
        </div>
      </header>

      {/* ─── divider ─── */}
      <div className="ourstory-divider"><div className="ourstory-divider__line" /></div>

      {/* ═══ 2. THE IDEA BEHIND SHROOOMS ═══ */}
      <section className="ourstory-section">
        <div className="ourstory-idea">
          <span className="ourstory-idea__marker" aria-hidden="true">I</span>
          <div className="ourstory-idea__body">
            <h2 className="ourstory-idea__heading">
              The Idea Behind SHROOOMS
            </h2>
            <p className="ourstory-idea__text">
              Mushrooms are often presented only as generic ingredients or isolated
              products without context. Finding reliable information about specific
              varieties, understanding how to use them, or accessing premium
              cultivars can be surprisingly difficult.
            </p>
            <p className="ourstory-idea__text">
              SHROOOMS aims to create a clearer experience — a single place where
              people can discover different mushroom varieties, understand what
              makes each one distinct, explore recipes and culinary applications,
              access grow-at-home offerings, and connect directly for wholesale
              inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* ─── divider ─── */}
      <div className="ourstory-divider"><div className="ourstory-divider__line" /></div>

      {/* ═══ 3. WHAT WE ARE BUILDING ═══ */}
      <section className="ourstory-section">
        <div className="ourstory-building">
          <h2 className="ourstory-building__statement">
            What We Are Building
          </h2>
          <div className="ourstory-building__pillars">
            <div className="ourstory-pillar">
              <span className="ourstory-pillar__number">01</span>
              <div>
                <p className="ourstory-pillar__title">
                  Gourmet Mushroom Discovery
                </p>
                <p className="ourstory-pillar__desc">
                  A curated catalog of premium gourmet cultivars — from Lion's Mane
                  and King Oyster to Pink and Blue Oyster — with clear product
                  information and variety-specific detail.
                </p>
              </div>
            </div>
            <div className="ourstory-pillar">
              <span className="ourstory-pillar__number">02</span>
              <div>
                <p className="ourstory-pillar__title">
                  Recipes &amp; Culinary Education
                </p>
                <p className="ourstory-pillar__desc">
                  Practical recipes and preparation guidance that show how each
                  mushroom variety can be used in everyday cooking.
                </p>
              </div>
            </div>
            <div className="ourstory-pillar">
              <span className="ourstory-pillar__number">03</span>
              <div>
                <p className="ourstory-pillar__title">
                  Grow-at-Home Offerings
                </p>
                <p className="ourstory-pillar__desc">
                  Fully colonized substrate fruiting blocks that allow customers
                  to grow fresh mushrooms at home.
                </p>
              </div>
            </div>
            <div className="ourstory-pillar">
              <span className="ourstory-pillar__number">04</span>
              <div>
                <p className="ourstory-pillar__title">
                  Wholesale Access
                </p>
                <p className="ourstory-pillar__desc">
                  A direct inquiry route for restaurants, chefs, and businesses
                  looking for consistent, quality mushroom supply.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── divider ─── */}
      <div className="ourstory-divider"><div className="ourstory-divider__line" /></div>

      {/* ═══ 4. FROM DISCOVERY TO EXPERIENCE ═══ */}
      <section className="ourstory-section">
        <h2 className="ourstory-idea__heading" style={{ marginBottom: "4.8rem" }}>
          From Discovery to Experience
        </h2>
        <div className="ourstory-journey">
          <div className="ourstory-journey__step">
            <span className="ourstory-journey__num">01</span>
            <h3 className="ourstory-journey__title">Discover</h3>
            <p className="ourstory-journey__desc">
              Explore available mushroom varieties and products through the
              SHROOOMS catalog. Browse by type, understand what makes each
              cultivar distinct.
            </p>
          </div>
          <div className="ourstory-journey__step">
            <span className="ourstory-journey__num">02</span>
            <h3 className="ourstory-journey__title">Understand</h3>
            <p className="ourstory-journey__desc">
              Use product information, recipes, and educational content to learn
              how each mushroom variety can be prepared and enjoyed.
            </p>
          </div>
          <div className="ourstory-journey__step">
            <span className="ourstory-journey__num">03</span>
            <h3 className="ourstory-journey__title">Choose</h3>
            <p className="ourstory-journey__desc">
              Select fresh gourmet products or grow-at-home fruiting blocks based
              on your culinary interest and experience level.
            </p>
          </div>
          <div className="ourstory-journey__step">
            <span className="ourstory-journey__num">04</span>
            <h3 className="ourstory-journey__title">Experience</h3>
            <p className="ourstory-journey__desc">
              Cook, grow, explore, or contact SHROOOMS for wholesale requirements.
              Each product is part of a broader mushroom experience.
            </p>
          </div>
        </div>
      </section>

      {/* ─── divider ─── */}
      <div className="ourstory-divider"><div className="ourstory-divider__line" /></div>

      {/* ═══ 5. HOW WE APPROACH THE PRODUCT ═══ */}
      <section className="ourstory-section">
        <div className="ourstory-approach">
          <img
            src="/shroooms_farm_story.png"
            alt="SHROOOMS controlled-environment cultivation facility in Indore"
            className="ourstory-approach__image"
            loading="lazy"
          />
          <div className="ourstory-approach__content">
            <h2 className="ourstory-approach__heading">
              How We Approach the Product
            </h2>
            <p className="ourstory-approach__text">
              SHROOOMS cultivates gourmet mushrooms in Indore using indoor
              controlled-environment vertical farming. Every stage — from substrate
              preparation to harvest and packaging — is managed to prioritize
              product quality and food safety.
            </p>
            <div className="ourstory-approach__markers">
              <div className="ourstory-approach__marker">
                <div className="ourstory-approach__marker-dot" />
                <span className="ourstory-approach__marker-text">
                  Indoor vertical cultivation in Indore
                </span>
              </div>
              <div className="ourstory-approach__marker">
                <div className="ourstory-approach__marker-dot" />
                <span className="ourstory-approach__marker-text">
                  Careful cluster selection at optimal density
                </span>
              </div>
              <div className="ourstory-approach__marker">
                <div className="ourstory-approach__marker-dot" />
                <span className="ourstory-approach__marker-text">
                  Hygienic packing in food-grade containers
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── divider ─── */}
      <div className="ourstory-divider"><div className="ourstory-divider__line" /></div>

      {/* ═══ 6. PRINCIPLES THAT GUIDE SHROOOMS ═══ */}
      <section className="ourstory-section">
        <div className="ourstory-principles">
          <h2 className="ourstory-principles__heading">
            Principles That Guide SHROOOMS
          </h2>
          <div className="ourstory-principles__list">
            <div className="ourstory-principle">
              <p className="ourstory-principle__number">01</p>
              <p className="ourstory-principle__title">
                Clear Product Information
              </p>
              <p className="ourstory-principle__desc">
                Every mushroom variety is presented with honest, specific detail
                about its characteristics, culinary use, and available formats.
              </p>
            </div>
            <div className="ourstory-principle">
              <p className="ourstory-principle__number">02</p>
              <p className="ourstory-principle__title">
                Practical Discovery
              </p>
              <p className="ourstory-principle__desc">
                Products are organized so customers can browse by type, explore
                related recipes, and understand what they are purchasing.
              </p>
            </div>
            <div className="ourstory-principle">
              <p className="ourstory-principle__number">03</p>
              <p className="ourstory-principle__title">
                Culinary Exploration
              </p>
              <p className="ourstory-principle__desc">
                Recipes and preparation guidance help customers use mushroom
                products in everyday cooking — not just as specialty ingredients.
              </p>
            </div>
            <div className="ourstory-principle">
              <p className="ourstory-principle__number">04</p>
              <p className="ourstory-principle__title">
                Accessible Product Experiences
              </p>
              <p className="ourstory-principle__desc">
                From fresh gourmet mushrooms to grow-at-home blocks, the product
                range aims to make mushroom experiences approachable for everyone.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── divider ─── */}
      <div className="ourstory-divider"><div className="ourstory-divider__line" /></div>

      {/* ═══ 7. FUTURE DIRECTION ═══ */}
      <section className="ourstory-section ourstory-section--narrow">
        <div className="ourstory-future">
          <span className="ourstory-future__eyebrow">Looking Ahead</span>
          <h2 className="ourstory-future__heading">
            What SHROOOMS Aims to Explore Next
          </h2>
          <p className="ourstory-future__text">
            SHROOOMS intends to continue improving how people discover mushroom
            varieties, access product information, explore culinary uses, and
            connect with mushroom products and grow-at-home experiences. The focus
            remains on building a clearer, more useful platform for mushroom
            discovery and commerce.
          </p>
        </div>
      </section>

      {/* ═══ FINAL CTA ═══ */}
      <section className="ourstory-cta">
        <div className="ourstory-cta__inner">
          <h2 className="ourstory-cta__heading">
            Explore What SHROOOMS Is Growing.
          </h2>
          <div className="ourstory-cta__actions">
            <Link
              to="/#produce-list"
              className="ourstory-cta__btn ourstory-cta__btn--primary"
            >
              Explore Products
            </Link>
            <Link
              to="/wholesale"
              className="ourstory-cta__btn ourstory-cta__btn--secondary"
            >
              Wholesale Inquiries
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
};

export default OurStory;
