import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { supabase, isSupabaseConfigured } from "../../supabase";
import { normalizeBlogPost } from "./blogNormalizer";
import { updateBlogMetadata, clearBlogMetadata } from "./blogMetadata";
import { injectBlogPostingSchema, removeBlogSchema } from "./blogStructuredData";
import "./BlogArticle.css";

const DEFAULT_BLOG_POSTS = [
  {
    id: "adaptogens-stress-relief",
    title: "Demystifying Adaptogens: How Reishi & Lion's Mane Balance Stress",
    category: "science",
    author: "SHROOOMS Editorial Team",
    date: "June 18, 2026",
    readTime: "5 min read",
    icon: "fa-flask",
    summary: "An in-depth look at beta-glucans, triterpenes, and how functional mushrooms help the nervous system adapt to physical and mental stressors.",
    paragraphs: [
      "In our fast-paced modern world, chronic stress has become a silent epidemic. While the body's stress response is vital for survival, prolonged activation of the fight-or-flight pathway can lead to fatigue, cognitive decline, and weakened immunity. Enter adaptogens—a unique class of natural fungi that assist the body in maintaining homeostasis under stress.",
      "Reishi (Ganoderma lucidum), often called the 'Mushroom of Immortality', is a primary adaptogen. Scientifically, Reishi contains active triterpenoids called ganoderic acids. Preliminary laboratory studies suggest Reishi contains ganoderic acids that may support a balanced response to occasional stress. Traditional wellness practices have long valued Reishi for promoting a general sense of calm and supporting restful sleep.",
      "Simultaneously, Lion's Mane (Hericium erinaceus) addresses stress from a cognitive standpoint. It contains two unique families of compounds: hericenones and erinacines. Researchers are exploring how compounds like hericenones and erinacines in Lion's Mane might support cognitive wellness. In preclinical models, these compounds have been studied for their potential to support Nerve Growth Factor (NGF) synthesis, which plays a role in brain cell maintenance. Many users incorporate Lion's Mane into their daily routine to support focus and mental clarity.",
      "Integrating these functional adaptogens into your routine is simple. Consistent daily intake—whether through fresh sautéed culinary cultivars or concentrated hot water extracts—is key. Adaptogens do not offer a temporary stimulant spike; instead, they build cumulative cellular resilience over weeks of consistent use, empowering your body to stand strong against stress."
    ]
  },
  {
    id: "dry-sear-culinary-science",
    title: "Culinary Masterclass: The Science of the Dry Sear",
    category: "culinary",
    author: "SHROOOMS Editorial Team",
    date: "May 24, 2026",
    readTime: "4 min read",
    icon: "fa-cutlery",
    summary: "Why dry-searing mushrooms in a piping hot skillet before adding butter or oils yields the best texture and maximizes caramelization.",
    paragraphs: [
      "For years, standard culinary school advice suggested melting butter or heating oil in a pan before adding mushrooms. However, if you've ever cooked mushrooms this way, you've likely noticed a common issue: they immediately absorb the fat like tiny sponges, turn soggy, and then release a pool of water, leaving them boiling in their own juices rather than browning.",
      "The science of mushroom structure explains this. Mushrooms are roughly 85% to 92% water, and their cell walls are made of chitin (a tough polymer also found in the shells of crustaceans) rather than cellulose. chitin does not break down easily under heat, meaning mushrooms can withstand high temperatures without turning mushy. To get a perfect brown sear, we must first collapse these cell walls and evaporate the internal moisture.",
      "The dry sear method is simple. Place your sliced mushrooms into a hot, completely dry cast-iron or stainless steel skillet over medium-high heat. Do not add oil, butter, or salt. Spread them in a single layer. Within 2-3 minutes, you will hear a loud sizzling as the mushrooms begin to steam and shrink, releasing their cell-bound water.",
      "Continue cooking for another 3-4 minutes, letting the liquid evaporate. Once the pan is dry again and the edges of the mushrooms start to take on a golden color, it's time to add your fat—butter, olive oil, or ghee—along with minced garlic, shallots, and fresh herbs. The mushrooms, now deflated and partially cooked, will no longer absorb excessive grease. Instead, the fat will coat the outside, crisping the edges and triggering the Maillard reaction for an incredibly rich, caramelized umami flavor."
    ]
  },
  {
    id: "substrate-growing-efficiency",
    title: "Substrate Selection: Hardwood vs. Agricultural Byproducts",
    category: "cultivation",
    author: "SHROOOMS Editorial Team",
    date: "April 12, 2026",
    readTime: "7 min read",
    icon: "fa-pagelines",
    summary: "How choosing sawdust, wheat bran, or agricultural straw changes colonization rates and biological efficiency in commercial mushroom farms.",
    paragraphs: [
      "In commercial mushroom cultivation, the media on which your mycelium feeds—known as the substrate—is the single most critical factor determining your crop's yield, speed, and nutritional content. Unlike plants that rely on soil and photosynthesis, mushrooms are saprotrophic, meaning they secrete enzymes to decompose complex organic matter for food.",
      "Wood-decay fungi like Lion's Mane, Shiitake, and Oyster mushrooms naturally decompose lignin and cellulose found in trees. In our automated greenhouse, we replicate this by using sterilized hardwood sawdust (primarily oak or maple) as our base substrate. However, sawdust alone lacks the high nitrogen levels required to produce heavy, dense fruiting bodies.",
      "To solve this, we practice 'substrate formulation' by adding organic agricultural byproducts. We blend the sawdust with wheat bran at a ratio of 80% wood to 20% bran. The wheat bran acts as a nutritional supplement, providing nitrogen, vitamins, and minerals that boost the biological efficiency (the ratio of fresh mushroom weight to dry substrate weight) from a meager 40% to over 100%.",
      "Other farms use agricultural straw (like wheat or paddy straw) which is pasteurized rather than sterilized. Straw is cheaper and excellent for fast-growing Oyster mushrooms, but it doesn't support the slower, wood-loving species like Shiitake or Reishi. By sourcing organic, local hardwood and grain byproducts, we ensure Shroooms' crops grow in a premium, chemical-free environment, yielding the highest concentrations of active health compounds."
    ]
  },
  {
    id: "wood-wide-web-mycelium",
    title: "The Wood Wide Web: Mycelial Networks in Forest Ecosystems",
    category: "science",
    author: "SHROOOMS Editorial Team",
    date: "March 29, 2026",
    readTime: "6 min read",
    icon: "fa-globe",
    summary: "Exploring the symbiotic underground networks connecting trees, facilitating nutrient exchange, and maintaining soil health.",
    paragraphs: [
      "Beneath the forest floor lies a complex, hidden network that challenges our traditional views of plant competition and individuality. Often referred to as the 'Wood Wide Web', this subterranean infrastructure is constructed by mycorrhizal fungi—underground mycelial threads that weave into and around the roots of trees and plants.",
      "This association is highly symbiotic. Trees, through photosynthesis, produce carbon-rich sugars and share them with the fungi. In exchange, the microscopic mycelial threads, which can navigate tiny soil crevices inaccessible to tree roots, supply the trees with essential water, phosphorus, and nitrogen. A single teaspoon of healthy forest soil can contain miles of these fungal filaments.",
      "More fascinatingly, this network operates as an active communication and distribution channel. If a mature tree has access to abundant sunlight, it can send surplus sugars through the mycelial network to support younger saplings growing in the shade. Furthermore, if a tree is attacked by pests, it can transmit chemical warning signals through the fungus to neighboring trees, allowing them to synthesize defensive toxins before the pests arrive.",
      "Understanding these mycelial networks shifts our perspective of the forest from a collection of competing trees to a cooperative, super-organism. Fungi are not merely decomposers; they are the connectors, neural pathways, and caretakers of the biosphere, proving that life thrives best when connected in mutual support."
    ]
  }
];

const BlogArticle = () => {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [related, setRelated] = useState([]);
  const [status, setStatus] = useState("LOADING"); // LOADING | SUCCESS | ERROR | NOT_FOUND
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearBlogMetadata();
      removeBlogSchema();
    };
  }, []);

  useEffect(() => {
    const fetchArticleData = async () => {
      setStatus("LOADING");
      let allPosts = [];

      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from("blogs").select("*");
          if (!error && data && data.length > 0) {
            allPosts = data.map(normalizeBlogPost).filter(Boolean);
          } else {
            console.warn("Supabase fetch returned empty, attempting local recovery");
          }
        } catch (err) {
          console.error("Supabase fetch error inside BlogArticle:", err);
          if (isMountedRef.current) {
            setStatus("ERROR");
          }
          return;
        }
      }

      // If Supabase fetch was unsuccessful or empty, try localStorage fallback
      if (allPosts.length === 0) {
        const saved = localStorage.getItem("mock_blogs");
        if (saved) {
          try {
            allPosts = JSON.parse(saved).map(normalizeBlogPost).filter(Boolean);
          } catch (e) {
            allPosts = DEFAULT_BLOG_POSTS.map(normalizeBlogPost).filter(Boolean);
          }
        } else {
          allPosts = DEFAULT_BLOG_POSTS.map(normalizeBlogPost).filter(Boolean);
        }
      }

      const currentPost = allPosts.find((p) => p.slug === slug);
      if (!currentPost) {
        if (isMountedRef.current) {
          setStatus("NOT_FOUND");
          updateBlogMetadata({
            title: "Article Not Found | Shrooom Chronicles",
            description: "The requested blog article could not be found.",
            noindex: true
          });
        }
        return;
      }

      // Deterministic category-based related article resolution
      const categoryRelated = allPosts
        .filter((p) => p.slug !== currentPost.slug && p.category === currentPost.category)
        .sort((a, b) => a.slug.localeCompare(b.slug)) // Deterministic alphabetical sort fallback
        .slice(0, 2);

      if (isMountedRef.current) {
        setPost(currentPost);
        setRelated(categoryRelated);
        setStatus("SUCCESS");

        // Inject SEO and Structured Data
        updateBlogMetadata({
          title: `${currentPost.title} | Shrooom Chronicles`,
          description: currentPost.excerpt || "Read this article from the SHROOOMS Editorial Team.",
          slug: currentPost.slug
        });
        injectBlogPostingSchema(currentPost);
      }
    };

    fetchArticleData();
  }, [slug]);

  if (status === "LOADING") {
    return (
      <div className="blog-container">
        <div className="blog-inner" style={{ textAlign: "center", padding: "6rem 2rem" }}>
          <i className="fa fa-spinner fa-spin" style={{ fontSize: "4rem", color: "var(--frugivore-green)" }}></i>
          <p style={{ marginTop: "2rem", fontSize: "1.6rem", color: "var(--frugivore-gray)" }}>Loading article details...</p>
        </div>
      </div>
    );
  }

  if (status === "ERROR") {
    return (
      <div className="blog-container">
        <div className="blog-inner" style={{ textAlign: "center", padding: "6rem 2rem" }}>
          <i className="fa fa-exclamation-triangle" style={{ fontSize: "4rem", color: "#d96f7c", marginBottom: "2rem" }}></i>
          <h2 style={{ fontSize: "2.4rem", marginBottom: "1rem" }}>Failed to Load Article</h2>
          <p style={{ fontSize: "1.5rem", color: "var(--frugivore-gray)", marginBottom: "3rem" }}>
            An error occurred while connecting to the database. Please check your connection.
          </p>
          <Link to="/blog" className="close-reader-footer-btn" style={{ textDecoration: "none" }}>
            Back to Chronicles
          </Link>
        </div>
      </div>
    );
  }

  if (status === "NOT_FOUND") {
    return (
      <div className="blog-container">
        <div className="blog-inner" style={{ textAlign: "center", padding: "6rem 2rem" }}>
          <i className="fa fa-chain-broken" style={{ fontSize: "4rem", color: "#d96f7c", marginBottom: "2rem" }}></i>
          <h2 style={{ fontSize: "2.4rem", marginBottom: "1rem" }}>Article Not Found</h2>
          <p style={{ fontSize: "1.5rem", color: "var(--frugivore-gray)", marginBottom: "3rem" }}>
            The article you are looking for does not exist or has been moved.
          </p>
          <Link to="/blog" className="close-reader-footer-btn" style={{ textDecoration: "none" }}>
            Back to Chronicles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-container">
      <div className="blog-inner animate__animated animate__fadeIn">
        
        {/* Breadcrumbs */}
        <nav className="blog-breadcrumb">
          <Link to="/">Home</Link>
          <span className="bc-sep">/</span>
          <Link to="/blog">Chronicles</Link>
          <span className="bc-sep">/</span>
          <span className="bc-current">{post.title}</span>
        </nav>

        <article className="article-content">
          <header className="article-header">
            <span className="article-category-label">{post.category.toUpperCase()}</span>
            <h1 className="article-main-title font-serif">{post.title}</h1>
            
            <div className="article-meta-strip">
              <span className="author">By {post.author}</span>
              {post.datePublished && (
                <>
                  <span className="dot">•</span>
                  <span className="date">{post.datePublished}</span>
                </>
              )}
            </div>
            
            <div className="article-divider-ws"></div>
          </header>

          {/* Fallback visual placeholder instead of category-based fake image */}
          <div className="article-media-placeholder">
            <div className="placeholder-content">
              <i className={`fa ${post.icon || "fa-book"} placeholder-icon`}></i>
              <span className="placeholder-label">{post.category.toUpperCase()} EDITORIAL</span>
            </div>
          </div>

          <div className="article-body">
            {post.body.map((para, idx) => (
              <p key={idx} className={idx === 0 ? "article-intro-para" : ""}>
                {para}
              </p>
            ))}
          </div>

          {/* Contextual Conversion bridges */}
          <section className="article-conversion-bridge">
            <h4>Explore Fungi Products</h4>
            <p>Ready to try organic cultivars? Buy premium fruiting substrates and kits from our store.</p>
            <div className="bridge-ctas">
              <Link to="/#products" className="adm-btn adm-btn-primary" style={{ padding: "1.2rem 2.5rem", borderRadius: "10px", textDecoration: "none", fontSize: "1.3rem", fontWeight: 700 }}>
                Shop Fresh Cultivars
              </Link>
              <Link to="/wholesale" className="adm-btn adm-btn-ghost" style={{ padding: "1.2rem 2.5rem", borderRadius: "10px", textDecoration: "none", fontSize: "1.3rem", fontWeight: 700, marginLeft: "1.5rem" }}>
                B2B Wholesale Inquiry
              </Link>
            </div>
          </section>

          <footer className="article-footer">
            <div className="author-bio-card">
              <i className="fa fa-user-circle-o bio-icon"></i>
              <div>
                <h5>{post.author}</h5>
                <p>Official contributor to Shroooms Chronicles, documenting indoor vertical cultivation logs, mycological ecosystems, and kitchen masterclasses.</p>
              </div>
            </div>

            {/* Related Articles Section */}
            {related.length > 0 && (
              <div className="related-articles-section">
                <h3 className="related-title font-serif">Related Chronicles</h3>
                <div className="related-grid">
                  {related.map((item) => (
                    <div key={item.slug} className="related-card">
                      <div className="related-card-header">
                        <span className="related-cat">{item.category.toUpperCase()}</span>
                      </div>
                      <h4 className="related-card-title">{item.title}</h4>
                      <Link to={`/blog/${item.slug}`} className="read-full-btn" style={{ fontSize: "1.25rem" }}>
                        Read Article <i className="fa fa-long-arrow-right"></i>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ textAlign: "center", marginTop: "4rem" }}>
              <Link to="/blog" className="close-reader-footer-btn" style={{ textDecoration: "none" }}>
                Back to Chronicles
              </Link>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
};

export default BlogArticle;
