import React, { Fragment, useEffect, useState } from "react";
import LoadingBox from "../../components/LoadingBox/LoadingBox";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import { withRouter, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import vegetablesList from "../../store/actions/actionCreators/productsListAction";
import Sidebar from "../../components/Sidebar/Sidebar";
import Product from "../../container/Product/Product";
import { signInOpen } from "../../store/actions/actionCreators/signInAction";
import "./Home.css";

const Home = (props) => {
  const dispatch = useDispatch();

  const vegetablesData = useSelector((state) => state.products);
  const removeFromWishlist = useSelector((state) => state.removeFromWishlist);
  const wishlist = useSelector((state) => state.wishlist);
  const searchTerm = useSelector((state) => state.searchFilter);

  const { loading, error, vegetables } = vegetablesData;

  useEffect(() => {
    dispatch(vegetablesList());
    document.title = "Shroooms | Buy Fresh Gourmet Mushrooms & Grow Kits Online";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Buy fresh organic gourmet mushrooms online in India. Order fresh Lion's Mane, Pink Oyster, Blue Oyster, and King Oyster mushrooms grown locally in Indore.");
    }
  }, [dispatch]);



  useEffect(() => {
    if (removeFromWishlist.loading === false) {
      dispatch(vegetablesList());
    }
  }, [dispatch, removeFromWishlist]);

  useEffect(() => {
    if (wishlist.success === true) {
      dispatch(vegetablesList());
    }
  }, [dispatch, wishlist]);

  useEffect(() => {
    if (props.history.location.state === undefined) {
      return false;
    }
    if (props.history.location.state.pathname === "/orders") {
      dispatch(signInOpen());
    }
    if (props.history.location.state.pathname === "/wishlist") {
      dispatch(signInOpen());
    }
  }, [props.history.location.state, dispatch]);

  // Box showcase auto-switcher
  const boxes = [
    { src: "/banner_nourish.jpg",   alt: "Nourish Your Body banner",  color: "#1e352f", glow: "radial-gradient(circle, #e2ebd5 0%, transparent 70%)" },
    { src: "/banner_boxes.jpg",     alt: "Rare Gourmet Mushrooms boxes", color: "#b8960c", glow: "radial-gradient(circle, #fcf6d6 0%, transparent 70%)" },
    { src: "/banner_pouches.jpg",   alt: "Premium Gourmet Mushrooms bags", color: "#8b6f47", glow: "radial-gradient(circle, #f5ecd5 0%, transparent 70%)" },
    { src: "/banner_doorstep.jpg",  alt: "Fresh Mushrooms doorstep banner", color: "#c0566a", glow: "radial-gradient(circle, #faebed 0%, transparent 70%)" },
  ];
  const [activeBox, setActiveBox] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setActiveBox((p) => (p + 1) % boxes.length), 4000);
    return () => clearInterval(timer);
  }, [boxes.length]);

  const filterProducts =
    vegetables &&
    vegetables.filter((vegetable) => {
      if (
        vegetable.name.toLowerCase().includes(searchTerm) ||
        vegetable.description.toLowerCase().includes(searchTerm)
      ) {
        return vegetable;
      }
      return false;
    });

  return (
    <Fragment>
      {/* Hero Banner Section */}
      {/* Hero Banner Section */}
      <section className="home-hero">
        <div className="hero-left">
          <div className="hero-top-strip">
            <div className="hero-strip-line"></div>
            <span className="grown-care-tag">Grown with care, made for you <span className="heart-icon">♡</span></span>
          </div>

          <h1 className="hero-title">
            RARE<br />
            GOURMET<br />
            <span className="cursive-title">Mushrooms</span>
          </h1>
          
          <p className="hero-subtitle">
            Premium functional nutrition, sustainably cultivated for the modern kitchen. Experience the forest's hidden treasures.
          </p>
          
          <div className="hero-features">
            <div className="hero-feat-item">
              <svg viewBox="0 0 24 24" className="feat-svg-icon">
                <path d="M12 2C12 2 6 7 6 12C6 17 12 22 12 22C12 22 18 17 18 12C18 7 12 2 12 2Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M12 2V22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="feat-num">100%</span>
              <span className="feat-lbl">ORGANIC</span>
            </div>
            <div className="hero-feat-item">
              <svg viewBox="0 0 24 24" className="feat-svg-icon">
                <path d="M22 12H18L15 21L9 3L6 12H2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <span className="feat-num">HIGH</span>
              <span className="feat-lbl">PROTEIN</span>
            </div>
            <div className="hero-feat-item">
              <svg viewBox="0 0 24 24" className="feat-svg-icon">
                <path d="M12 22C12 22 12 14 19 12C12 10 12 2 12 2C12 2 12 10 5 12C12 14 12 22 12 22Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
              <span className="feat-num">IMMUNITY</span>
              <span className="feat-lbl">BOOSTING</span>
            </div>
            <div className="hero-feat-item">
              <svg viewBox="0 0 24 24" className="feat-svg-icon">
                <path d="M7 22H17L19 16H5L7 22Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                <path d="M12 16V10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M12 10C12 10 15 7 19 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M12 12C12 12 9 9 5 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              <span className="feat-num">RICH IN</span>
              <span className="feat-lbl">NUTRIENTS</span>
            </div>
          </div>
          
          <div className="hero-cta">
            <a href="#produce-list" className="hero-btn-primary">SHOP NOW <span className="btn-arrow">↗</span></a>
            <Link to="/our-story" className="hero-btn-secondary">OUR STORY <span className="btn-arrow">→</span></Link>
          </div>
        </div>
        
        <div className="hero-right">
          <div className="hero-box-showcase">
            <div className="box-glow" style={{ background: boxes[activeBox].glow }} />
            {boxes.map((box, i) => (
              <img
                key={box.src}
                src={box.src}
                alt={box.alt}
                className={`hero-box-img ${i === activeBox ? "active" : ""}`}
              />
            ))}
            <div className="box-dots">
              {boxes.map((_, i) => (
                <button
                  key={i}
                  className={`box-dot ${i === activeBox ? "active" : ""}`}
                  onClick={() => setActiveBox(i)}
                  style={i === activeBox ? { background: boxes[activeBox].color } : {}}
                />
              ))}
            </div>
            <div className="premium-quality-stamp">
              <span className="stamp-premium">Premium</span>
              <span className="stamp-gourmet">GOURMET</span>
              <span className="stamp-sustainable">SUSTAINABLY GROWN</span>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Cards / Bottom Bar Section */}
      <section className="home-trust">
        <div className="trust-card">
          <div className="trust-icon-box">
            <i className="fa fa-truck"></i>
          </div>
          <div className="trust-info">
            <h4>FRESHLY HARVESTED</h4>
            <p>Packed & delivered with care</p>
          </div>
        </div>
        <div className="trust-card">
          <div className="trust-icon-box">
            <i className="fa fa-leaf"></i>
          </div>
          <div className="trust-info">
            <h4>SUSTAINABLY GROWN</h4>
            <p>Clean, eco-friendly & responsible</p>
          </div>
        </div>
        <div className="trust-card">
          <div className="trust-icon-box">
            <i className="fa fa-snowflake-o"></i>
          </div>
          <div className="trust-info">
            <h4>COLD CHAIN DELIVERY</h4>
            <p>Maintaining freshness at every step</p>
          </div>
        </div>
        <div className="trust-card">
          <div className="trust-icon-box">
            <i className="fa fa-heart"></i>
          </div>
          <div className="trust-info">
            <h4>LOVED BY CHEFS</h4>
            <p>Preferred by chefs & nutritionists</p>
          </div>
        </div>
      </section>

      {/* Product Section Header */}
      <div className="section-head" id="produce-list">
        <div>
          <div className="section-eyebrow">Our Cultivars</div>
          <h2 className="section-title">Shop by <em>variety</em></h2>
        </div>
        <a href="/" className="section-link">View all gourmet mushrooms →</a>
      </div>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <ErrorBox varient="error">{error}</ErrorBox>
      ) : (
        <div className="row center">
          {filterProducts &&
            filterProducts.map((vegetable) => (
              <Product key={vegetable._id} product={vegetable} />
            ))}
        </div>
      )}
      <Sidebar />
    </Fragment>
  );
};
export default withRouter(Home);
