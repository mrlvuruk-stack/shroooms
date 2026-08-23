import React, { Fragment, useEffect, useState } from "react";
import LoadingBox from "../../components/LoadingBox/LoadingBox";
import ErrorBox from "../../components/ErrorBox/ErrorBox";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import vegetablesList from "../../store/actions/actionCreators/productsListAction";
import Sidebar from "../../components/Sidebar/Sidebar";
import Product from "../../container/Product/Product";
import { signInOpen } from "../../store/actions/actionCreators/signInAction";
import Hero from "../../components/Hero/Hero";
import CategoryGrid from "../../components/CategoryGrid/CategoryGrid";
import FeaturedProducts from "../../components/FeaturedProducts/FeaturedProducts";
import FarmStory from "../../components/FarmStory/FarmStory";
import FeaturedMushroom from "../../components/FeaturedMushroom/FeaturedMushroom";
import WhyChooseUs from "../../components/WhyChooseUs/WhyChooseUs";
import RecipesEducation from "../../components/RecipesEducation/RecipesEducation";
import WholesaleCTA from "../../components/WholesaleCTA/WholesaleCTA";
import SocialProof from "../../components/SocialProof/SocialProof";
import { CANONICAL_CATEGORIES, getCanonicalCategoryName } from "../../config/categoryConfig";
import "./Home.css";

const Home = (props) => {
  const dispatch = useDispatch();

  const vegetablesData = useSelector((state) => state.products);
  const removeFromWishlist = useSelector((state) => state.removeFromWishlist);
  const wishlist = useSelector((state) => state.wishlist);
  const searchTerm = useSelector((state) => state.searchFilter);

  const { loading, error, vegetables } = vegetablesData;

  // Category URL Query Parameter state synchronization
  const queryParams = new URLSearchParams(props.location.search);
  const categoryParam = queryParams.get("category");

  const [selectedCategory, setSelectedCategory] = useState(
    categoryParam ? getCanonicalCategoryName(categoryParam) : "All"
  );

  useEffect(() => {
    dispatch(vegetablesList());
    document.title = "Shroooms | Buy Fresh Gourmet Mushrooms & Grow Kits Online";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Buy fresh organic gourmet mushrooms online in India. Order fresh Lion's Mane, Pink Oyster, Blue Oyster, and King Oyster mushrooms grown locally in Indore.");
    }
  }, [dispatch]);

  // Keep state in sync with URL query param if present
  useEffect(() => {
    if (categoryParam) {
      const norm = getCanonicalCategoryName(categoryParam);
      setSelectedCategory(norm);
    }
  }, [categoryParam]);

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

  const handleSelectCategory = (catName) => {
    setSelectedCategory(catName);
    const slug = catName.toLowerCase().replace(/[^a-z0-9]/g, "-");
    props.history.push({
      pathname: "/",
      search: catName === "All" ? "" : `?category=${slug}`
    });
  };

  // STRICT Product Category Isolation
  const filterProducts = vegetables && vegetables.filter((veg) => {
    // 1. Strict Category Match
    if (selectedCategory && selectedCategory !== "All") {
      const prodCategory = getCanonicalCategoryName(veg.category);
      if (prodCategory.toLowerCase() !== selectedCategory.toLowerCase()) {
        return false;
      }
    }

    // 2. Search Term Filter
    if (searchTerm && searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase();
      const matchName = veg.name?.toLowerCase().includes(term);
      const matchDesc = veg.description?.toLowerCase().includes(term);
      if (!matchName && !matchDesc) return false;
    }

    return true;
  });

  return (
    <Fragment>
      <Hero />
      <CategoryGrid selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />
      <FeaturedProducts />

      {/* Product Section Header & Category Isolation Filter Tabs */}
      <div className="section-head" id="produce-list">
        <div>
          <div className="section-eyebrow">Strict Catalog Curation</div>
          <h2 className="section-title">Shop by <em>category</em></h2>
        </div>

        {/* Category Pill Tabs */}
        <div className="category-filter-pills-row" role="tablist">
          {CANONICAL_CATEGORIES.map((cat) => {
            const isActive = selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <button
                key={cat.id}
                role="tab"
                aria-selected={isActive}
                className={`category-pill-btn ${isActive ? "active-pill" : ""}`}
                onClick={() => handleSelectCategory(cat.name)}
              >
                {cat.icon} {cat.name}
              </button>
            );
          })}
        </div>
      </div>

      {loading ? (
        <LoadingBox />
      ) : error ? (
        <ErrorBox varient="error">{error}</ErrorBox>
      ) : filterProducts && filterProducts.length === 0 ? (
        <div className="empty-category-notice">
          <span className="empty-notice-icon">🍄</span>
          <h3>No items found in "{selectedCategory}"</h3>
          <p>Try selecting another category or view our complete catalog.</p>
          <button className="btn-primary" onClick={() => handleSelectCategory("All")}>
            Show All Products
          </button>
        </div>
      ) : (
        <div className="row center">
          {filterProducts &&
            filterProducts.map((vegetable) => (
              <Product key={vegetable._id} product={vegetable} />
            ))}
        </div>
      )}

      <FarmStory />
      <FeaturedMushroom />
      <WhyChooseUs />

      <RecipesEducation />
      <WholesaleCTA />
      <SocialProof />

      <Sidebar />
    </Fragment>
  );
};
export default withRouter(Home);

