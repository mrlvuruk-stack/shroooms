import React, { useEffect } from "react";
import "./OurStory.css";

const OurStory = () => {
  // Apply botanical watermark on mount and clean up on unmount
  useEffect(() => {
    const handleBgResize = () => {
      if (window.innerWidth > 1200) {
        document.body.style.backgroundImage = "url('/shroooms_bg_decor.png'), url('/shroooms_bg_decor.png')";
        document.body.style.backgroundPosition = "left -150px top 120px, right -150px top 120px";
        document.body.style.backgroundRepeat = "no-repeat, no-repeat";
        document.body.style.backgroundSize = "450px auto, 450px auto";
        document.body.style.backgroundAttachment = "fixed, fixed";
      } else {
        document.body.style.backgroundImage = "";
      }
    };

    handleBgResize();
    window.addEventListener("resize", handleBgResize);

    return () => {
      window.removeEventListener("resize", handleBgResize);
      document.body.style.backgroundImage = "";
      document.body.style.backgroundPosition = "";
      document.body.style.backgroundRepeat = "";
      document.body.style.backgroundSize = "";
      document.body.style.backgroundAttachment = "";
    };
  }, []);

  return (
    <div className="story-container">
      <div className="story-inner animate__animated animate__fadeIn">
        
        {/* ── HERO SECTION ── */}
        <header className="story-header-section">
          <span className="story-eyebrow">Our Story</span>
          <h1 className="story-title">From Curiosity to Cultivation</h1>
          <div className="story-divider"></div>
          <p className="story-motto">
            "Grown with Care. Chosen with Purpose. Made for You."
          </p>
        </header>

        {/* ── FOUNDING STORY & FARM ── */}
        <section className="story-content-grid">
          <div className="story-text-column">
            <div className="story-block">
              <p className="lead-paragraph">
                Shroooms was founded with a simple belief: <b>nature offers extraordinary nutrition when we choose the right ingredients.</b>
              </p>
              <p>
                In a market dominated by ordinary mushrooms, we set out to introduce something different—premium gourmet and functional mushrooms that combine exceptional taste with outstanding nutritional value.
              </p>
              <p>
                Our journey began with a passion for sustainable farming, clean cultivation, and the desire to make world-class gourmet mushrooms accessible to every home, chef, and health-conscious individual.
              </p>
              <p>
                Every mushroom is grown in a controlled environment using sustainable cultivation practices that prioritize freshness, quality, and food safety. From selecting premium substrates to maintaining optimal growing conditions, every stage is managed with precision and care.
              </p>
            </div>
          </div>

          <div className="story-image-column">
            <div className="story-img-card">
              <img 
                src="/shroooms_farm_story.png" 
                alt="Shroooms Sustainable Greenhouse Cultivation" 
                className="story-farm-image"
              />
              <div className="story-img-caption">
                <i className="fa fa-leaf"></i>
                <p>Misting cycle inside our automated Fruiting Chamber, maintaining optimal growing conditions.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURED VARIETIES GRID ── */}
        <section className="story-varieties-section">
          <h3 className="section-title">Specializing in Premium Cultivars</h3>
          <div className="varieties-grid">
            {[
              { 
                name: "Lion's Mane", 
                img: "/cultivar_lions_mane.jpg", 
                desc: "Supports brain health, focus, and memory. Celebrated as the ultimate natural cognitive enhancer and nerve support guide.", 
                bg: "#fcf8ee" 
              },
              { 
                name: "Reishi", 
                img: "/cultivar_reishi.jpg", 
                desc: "Known as the 'Mushroom of Immortality' for stress relief, immune support, sleep quality, and holistic longevity.", 
                bg: "#fdf3f2" 
              },
              { 
                name: "Cordyceps", 
                img: "/cultivar_cordyceps.jpg", 
                desc: "Boosts energy, stamina, and respiratory health. Highly valued by athletes for natural endurance and vitality.", 
                bg: "#fdf6eb" 
              },
              { 
                name: "Chaga", 
                img: "/cultivar_chaga.jpg", 
                desc: "A powerhouse of antioxidants that strengthens the body's natural defense, promoting vitality and cellular health.", 
                bg: "#f3f4f1" 
              },
              { 
                name: "Turkey Tail", 
                img: "/cultivar_turkey_tail.jpg", 
                desc: "Rich in polysaccharopeptides to nurture gut microbiome diversity and build robust immune response.", 
                bg: "#edf3f6" 
              },
              { 
                name: "Maitake", 
                img: "/cultivar_maitake.jpg", 
                desc: "The 'Mushroom of Harmony' that helps balance wellness, regulate blood sugar, and provide adaptogenic support.", 
                bg: "#f8f7f2" 
              }
            ].map(m => (
              <div className="variety-card" style={{ backgroundColor: m.bg }} key={m.name}>
                <div className="variety-image-wrapper">
                  <img src={m.img} alt={m.name} className="variety-img" />
                </div>
                <h4>{m.name}</h4>
                <p>{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHY WE EXIST & OUR PROMISE ── */}
        <section className="story-purpose-grid">
          <div className="purpose-card">
            <h3>Why We Exist</h3>
            <p>
              Modern lifestyles demand food that is not only delicious but also naturally nutritious.
            </p>
            <p>
              We believe gourmet mushrooms deserve a place in every kitchen—not just for their incredible flavor but for their versatility, freshness, and culinary excellence.
            </p>
            <p>
              Our mission is to bridge the gap between nature and modern living by delivering mushrooms that inspire healthier meals, creative recipes, and memorable dining experiences.
            </p>
          </div>

          <div className="promise-card">
            <h3>Our Promise</h3>
            <p className="promise-intro">At Shroooms, quality is never compromised. Every harvest is:</p>
            <ul className="promise-list">
              <li><i className="fa fa-check-circle"></i> Carefully cultivated</li>
              <li><i className="fa fa-check-circle"></i> Freshly harvested</li>
              <li><i className="fa fa-check-circle"></i> Hygienically packed</li>
              <li><i className="fa fa-check-circle"></i> Sustainably grown</li>
              <li><i className="fa fa-check-circle"></i> Delivered with care</li>
            </ul>
            <p className="promise-footer">
              Our commitment extends beyond producing premium mushrooms—we are building a brand that values trust, transparency, and long-term relationships with our customers.
            </p>
          </div>
        </section>

        {/* ── WHAT MAKES US DIFFERENT ── */}
        <section className="story-difference-card">
          <div className="difference-inner">
            <div className="diff-icon"><i className="fa fa-star"></i></div>
            <div className="diff-content">
              <h3>What Makes Us Different</h3>
              <p>
                Unlike conventional mushroom suppliers, Shroooms focuses exclusively on premium gourmet varieties. Whether you're a home cook exploring new recipes, a professional chef creating exceptional dishes, or someone looking for high-quality natural ingredients, our mushrooms are cultivated to meet the highest standards.
              </p>
            </div>
          </div>
        </section>

        {/* ── VISION & MISSION ── */}
        <section className="story-vision-mission">
          <div className="vision-box">
            <div className="box-icon"><i className="fa fa-eye"></i></div>
            <h4>Our Vision</h4>
            <p>
              To become India's most trusted premium gourmet mushroom brand by making exotic mushrooms a part of everyday healthy living while promoting sustainable agriculture and responsible food production.
            </p>
          </div>
          <div className="mission-box">
            <div className="box-icon"><i className="fa fa-rocket"></i></div>
            <h4>Our Mission</h4>
            <p>
              To cultivate and deliver premium gourmet mushrooms that combine exceptional freshness, superior quality, and sustainable farming practices, creating memorable culinary experiences for every customer.
            </p>
          </div>
        </section>

        {/* ── VALUES SECTION ── */}
        <section className="story-values-section">
          <h3 className="section-title">Our Values</h3>
          <div className="values-grid">
            {[
              { name: "Sustainability", img: "/value_sustainability.jpg", desc: "We cultivate responsibly while respecting nature in every step." },
              { name: "Premium Quality", img: "/value_premium_quality.jpg", desc: "Only the absolute finest mushrooms reach our customers' kitchens." },
              { name: "Freshness", img: "/value_freshness.jpg", desc: "Harvested with precision and delivered at peak nutritional quality." },
              { name: "Trust", img: "/value_trust.jpg", desc: "Honest farming, transparent practices, and dependable, reliable service." },
              { name: "Innovation", img: "/value_innovation.jpg", desc: "Bringing exotic culinary gourmet mushroom culture to homes and chefs across India." }
            ].map(v => (
              <div className="value-card-premium" key={v.name}>
                <div className="value-icon-image-wrapper">
                  <img src={v.img} alt={v.name} className="value-icon-img" />
                </div>
                <h5>{v.name}</h5>
                <p>{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default OurStory;
