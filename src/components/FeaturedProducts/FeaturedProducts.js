import React from "react";
import { useSelector } from "react-redux";
import { HOMEPAGE_CONFIG } from "../../config/homepageConfig";
import Product from "../../container/Product/Product";
import LoadingBox from "../LoadingBox/LoadingBox";
import ErrorBox from "../ErrorBox/ErrorBox";
import "./FeaturedProducts.css";

const FeaturedProducts = () => {
  const allProducts = useSelector((state) => state.products);
  const { vegetables, loading, error } = allProducts;
  const { featuredProducts } = HOMEPAGE_CONFIG;

  const selectFeatured = () => {
    if (!vegetables || vegetables.length === 0) return [];

    const configNames = featuredProducts.configuredNames || [];
    const selected = vegetables.filter((veg) =>
      configNames.some((name) => veg.name?.toLowerCase().includes(name.toLowerCase()))
    );

    const uniqueSelected = Array.from(new Set(selected));

    if (uniqueSelected.length > 0) {
      return uniqueSelected.slice(0, 4);
    }

    return [...vegetables]
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""))
      .slice(0, 4);
  };

  const selectedItems = selectFeatured();

  if (loading) {
    return (
      <section className="featured-section home-section" aria-label="Featured products loading">
        <LoadingBox />
      </section>
    );
  }

  if (error) {
    return (
      <section className="featured-section home-section" aria-label="Featured products error">
        <ErrorBox varient="error">{error}</ErrorBox>
      </section>
    );
  }

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <section className="featured-section home-section container-wide" aria-labelledby="featured-title">
      <div className="featured-header">
        <span className="featured-eyebrow" id="featured-title">Selected Range</span>
        <h2 className="featured-title">{featuredProducts.sectionTitle}</h2>
        <p className="featured-subtitle">{featuredProducts.sectionSubtitle}</p>
      </div>

      <div className="row center featured-products-grid">
        {selectedItems.map((prod) => (
          <Product key={prod._id} product={prod} />
        ))}
      </div>
    </section>
  );
};

export default FeaturedProducts;
