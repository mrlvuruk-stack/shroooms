import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { purchasingState } from "../../store/actions/actionCreators/addToCartAction";
import "./LedMarquee.css";

const CROSS_SELL_ITEMS = [
  {
    _id: "acc-1",
    name: "Ultra-Fine Spray Mister",
    price: 299,
    image: "/box_blue_oyster.jpg",
    badge: "Must Have"
  },
  {
    _id: "spg-1",
    name: "Bio-Cellulose Growing Sponge",
    price: 199,
    image: "/banner_nourish.jpg",
    badge: "Eco Essential"
  },
  {
    _id: "tool-1",
    name: "0.2 Micron Filter PP Bags",
    price: 399,
    image: "/banner_pouches.jpg",
    badge: "Lab Grade"
  },
  {
    _id: "lc-1",
    name: "Lion's Mane Liquid Culture 10ml",
    price: 499,
    image: "/box_lions_mane.jpg",
    badge: "Top Strain"
  },
  {
    _id: "tool-3",
    name: "Gypsum Substrate Buffer 900g",
    price: 149,
    image: "/value_premium_quality.jpg",
    badge: "Additive"
  }
];

const LedMarquee = () => {
  const dispatch = useDispatch();
  const [addedItems, setAddedItems] = useState({});

  const handleAddToCart = (item, e) => {
    e.stopPropagation();
    dispatch(purchasingState(item._id));
    setAddedItems((prev) => ({ ...prev, [item._id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [item._id]: false }));
    }, 2000);
  };

  // Duplicate items array to guarantee 100% seamless infinite loop
  const marqueeItems = [...CROSS_SELL_ITEMS, ...CROSS_SELL_ITEMS];

  return (
    <div className="shroooms-led-marquee-container">
      {/* LED Ticker Header */}
      <div className="marquee-header-bar">
        <span className="led-dot" />
        <span className="marquee-title-text">YOU CAN ADD THESE THINGS AS WELL</span>
        <span className="led-pill-tag">QUICK ADD</span>
      </div>

      {/* Infinite Scrolling Track */}
      <div className="marquee-viewport">
        <div className="marquee-track">
          {marqueeItems.map((item, idx) => (
            <div key={`${item._id}-${idx}`} className="marquee-card">
              <div className="marquee-card-thumb">
                <img src={item.image} alt={item.name} loading="lazy" />
                <span className="marquee-card-badge">{item.badge}</span>
              </div>
              <div className="marquee-card-info">
                <h4 className="marquee-card-title">{item.name}</h4>
                <div className="marquee-card-price-row">
                  <span className="marquee-card-price">&#8377;{item.price}</span>
                  <button
                    className={`marquee-add-btn ${addedItems[item._id] ? "added" : ""}`}
                    onClick={(e) => handleAddToCart(item, e)}
                    aria-label={`Add ${item.name} to cart`}
                  >
                    {addedItems[item._id] ? "✓ Added" : "+ Add"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LedMarquee;
