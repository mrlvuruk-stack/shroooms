// eslint-disable-next-line no-unused-vars
import React from "react";
import { HOMEPAGE_CONFIG } from "../../config/homepageConfig";

const SocialProof = () => {
  // Always returns null as verified review data does not exist in the database.
  // This complies with the strict "no fictional testimonials" requirement.
  if (!HOMEPAGE_CONFIG.showTestimonials) {
    return null;
  }

  return null;
};

export default SocialProof;
