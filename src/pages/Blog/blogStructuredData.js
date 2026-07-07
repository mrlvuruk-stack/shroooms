/**
 * Utility for dynamic JSON-LD injection and cleanup on route changes.
 */

const origin = "https://shrooom.in";
const SCRIPT_ID = "blog-json-ld";

export const injectBlogPostingSchema = (article) => {
  if (!article || !article.slug) return;

  // Cleanup existing script tag if any
  removeBlogSchema();

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.type = "application/ld+json";

  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${origin}/blog/${article.slug}`
    },
    "headline": article.title || "",
    "description": article.excerpt || "",
    "author": {
      "@type": "Organization",
      "name": "SHROOOMS Editorial Team",
      "url": origin
    },
    "publisher": {
      "@type": "Organization",
      "name": "SHROOOMS",
      "logo": {
        "@type": "ImageObject",
        "url": `${origin}/footer_logo.png`
      }
    }
  };

  // Safe dates mapping
  if (article.datePublished) {
    schema.datePublished = article.datePublished;
    schema.dateModified = article.dateModified || article.datePublished;
  }

  // Factual neutral image mapping
  schema.image = `${origin}/shrooom.jpg`;

  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
};

export const injectBlogCollectionSchema = () => {
  removeBlogSchema();

  const script = document.createElement("script");
  script.id = SCRIPT_ID;
  script.type = "application/ld+json";

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${origin}/blog`
    },
    "headline": "Shrooom Chronicles | Mycology, Science & Culinary Arts",
    "description": "Read the latest articles on mushroom superfoods, indoor vertical cultivation, recipes, and medicinal wellness guides from Shroooms experts.",
    "publisher": {
      "@type": "Organization",
      "name": "SHROOOMS",
      "logo": {
        "@type": "ImageObject",
        "url": `${origin}/footer_logo.png`
      }
    }
  };

  script.text = JSON.stringify(schema);
  document.head.appendChild(script);
};

export const removeBlogSchema = () => {
  const el = document.getElementById(SCRIPT_ID);
  if (el) el.remove();
};
