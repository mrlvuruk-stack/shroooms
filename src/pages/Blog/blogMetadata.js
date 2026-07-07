/**
 * Utilities for dynamic SEO metadata injection and cleanups during SPA navigation.
 */

const origin = "https://shrooom.in";

export const updateBlogMetadata = ({ title, description, slug, noindex = false }) => {
  // Update Title
  document.title = title || "Shrooom Chronicles | Mushroom Cultivation & Wellness Blog";

  // Helper to manage meta tags
  const setMetaTag = (nameOrProperty, value, isProperty = false) => {
    const attr = isProperty ? "property" : "name";
    let el = document.querySelector(`meta[${attr}="${nameOrProperty}"]`);
    if (value) {
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, nameOrProperty);
        document.head.appendChild(el);
      }
      el.setAttribute("content", value);
    } else if (el) {
      el.remove();
    }
  };

  // Update Description
  setMetaTag("description", description);

  // Update Robots Indexing
  if (noindex) {
    setMetaTag("robots", "noindex, follow");
  } else {
    setMetaTag("robots", "index, follow");
  }

  // Update Canonical Link
  const canonicalUrl = slug ? `${origin}/blog/${slug}` : `${origin}/blog`;
  let canonicalEl = document.querySelector('link[rel="canonical"]');
  if (!canonicalEl) {
    canonicalEl = document.createElement("link");
    canonicalEl.setAttribute("rel", "canonical");
    document.head.appendChild(canonicalEl);
  }
  canonicalEl.setAttribute("href", canonicalUrl);

  // Update Open Graph Metadata
  setMetaTag("og:title", title, true);
  setMetaTag("og:description", description, true);
  setMetaTag("og:url", canonicalUrl, true);
  setMetaTag("og:type", slug ? "article" : "website", true);
  setMetaTag("og:site_name", "SHROOOMS", true);
  // Neutral OG image
  setMetaTag("og:image", `${origin}/shrooom.jpg`, true);

  // Update Twitter Card Metadata
  setMetaTag("twitter:card", "summary_large_image");
  setMetaTag("twitter:title", title);
  setMetaTag("twitter:description", description);
  setMetaTag("twitter:image", `${origin}/shrooom.jpg`);
};

export const clearBlogMetadata = () => {
  const removeMeta = (nameOrProperty, isProperty = false) => {
    const attr = isProperty ? "property" : "name";
    const el = document.querySelector(`meta[${attr}="${nameOrProperty}"]`);
    if (el) el.remove();
  };

  removeMeta("description");
  removeMeta("robots");
  removeMeta("og:title", true);
  removeMeta("og:description", true);
  removeMeta("og:url", true);
  removeMeta("og:type", true);
  removeMeta("og:image", true);
  removeMeta("twitter:card");
  removeMeta("twitter:title");
  removeMeta("twitter:description");
  removeMeta("twitter:image");

  // Keep a generic canonical link pointing back to origin if needed
  const canonicalEl = document.querySelector('link[rel="canonical"]');
  if (canonicalEl) {
    canonicalEl.setAttribute("href", origin);
  }
};
