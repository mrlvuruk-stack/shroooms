import React, { Fragment, useEffect } from "react";
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
      <Hero />
      <CategoryGrid />
      <FeaturedProducts />

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
