import React, { useState, useEffect } from "react";
import "./Blog.css";

const BLOG_POSTS = [
  {
    id: "adaptogens-stress-relief",
    title: "Demystifying Adaptogens: How Reishi & Lion's Mane Balance Stress",
    category: "science",
    author: "Dr. Elena Rostova",
    date: "June 18, 2026",
    readTime: "5 min read",
    icon: "fa-flask",
    summary: "An in-depth look at beta-glucans, triterpenes, and how functional mushrooms help the nervous system adapt to physical and mental stressors.",
    paragraphs: [
      "In our fast-paced modern world, chronic stress has become a silent epidemic. While the body's stress response is vital for survival, prolonged activation of the fight-or-flight pathway can lead to fatigue, cognitive decline, and weakened immunity. Enter adaptogens—a unique class of natural herbs and fungi that assist the body in maintaining homeostasis under stress.",
      "Reishi (Ganoderma lucidum), often called the 'Mushroom of Immortality', is a primary adaptogen. Scientifically, Reishi contains active triterpenoids called ganoderic acids. These compounds have been shown in laboratory studies to bind to pathways in the central nervous system, calming neuronal excitability and modulating the adrenal response to lower cortisol levels. Many users report improved sleep quality and a feeling of groundedness after regular consumption.",
      "Simultaneously, Lion's Mane (Hericium erinaceus) addresses stress from a cognitive standpoint. It contains two unique families of compounds: hericenones and erinacines. These low-molecular-weight molecules cross the blood-brain barrier to stimulate the synthesis of Nerve Growth Factor (NGF). By encouraging the growth, maintenance, and repair of brain cells, Lion's Mane helps mitigate the neuro-inflammatory markers associated with chronic stress, improving mental clarity and reducing 'brain fog'.",
      "Integrating these functional adaptogens into your routine is simple. Consistent daily intake—whether through fresh sautéed culinary cultivars or concentrated hot water extracts—is key. Adaptogens do not offer a temporary stimulant spike; instead, they build cumulative cellular resilience over weeks of consistent use, empowering your body to stand strong against stress."
    ]
  },
  {
    id: "dry-sear-culinary-science",
    title: "Culinary Masterclass: The Science of the Dry Sear",
    category: "culinary",
    author: "Chef Sanjay Kapoor",
    date: "May 24, 2026",
    readTime: "4 min read",
    icon: "fa-cutlery",
    summary: "Why dry-searing mushrooms in a piping hot skillet before adding butter or oils yields the best texture and maximizes caramelization.",
    paragraphs: [
      "For years, standard culinary school advice suggested melting butter or heating oil in a pan before adding mushrooms. However, if you've ever cooked mushrooms this way, you've likely noticed a common issue: they immediately absorb the fat like tiny sponges, turn soggy, and then release a pool of water, leaving them boiling in their own juices rather than browning.",
      "The science of mushroom structure explains this. Mushrooms are roughly 85% to 92% water, and their cell walls are made of chitin (a tough polymer also found in the shells of crustaceans) rather than cellulose. chintin does not break down easily under heat, meaning mushrooms can withstand high temperatures without turning mushy. To get a perfect brown sear, we must first collapse these cell walls and evaporate the internal moisture.",
      "The dry sear method is simple. Place your sliced mushrooms into a hot, completely dry cast-iron or stainless steel skillet over medium-high heat. Do not add oil, butter, or salt. Spread them in a single layer. Within 2-3 minutes, you will hear a loud sizzling as the mushrooms begin to steam and shrink, releasing their cell-bound water.",
      "Continue cooking for another 3-4 minutes, letting the liquid evaporate. Once the pan is dry again and the edges of the mushrooms start to take on a golden color, it's time to add your fat—butter, olive oil, or ghee—along with minced garlic, shallots, and fresh herbs. The mushrooms, now deflated and partially cooked, will no longer absorb excessive grease. Instead, the fat will coat the outside, crisping the edges and triggering the Maillard reaction for an incredibly rich, caramelized umami flavor."
    ]
  },
  {
    id: "substrate-growing-efficiency",
    title: "Substrate Selection: Hardwood vs. Agricultural Byproducts",
    category: "cultivation",
    author: "Aarav Sharma (Head Grower)",
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
    author: "Dr. Elena Rostova",
    date: "March 29, 2026",
    readTime: "6 min read",
    icon: "fa-globe",
    summary: "Exploring the symbiotic underground networks connecting trees, facilitating nutrient exchange, and maintaining soil health.",
    paragraphs: [
      "Beneath the forest floor lies a complex, hidden network that challenges our traditional views of plant competition and individuality. Often referred to as the 'Wood Wide Web', this subterranean infrastructure is constructed by mycorrhizal fungi—underground mycelial threads that weave into and around the roots of trees and plants.",
      "This association is highly symbiotic. Trees, through photosynthesis, produce carbon-rich sugars and share them with the fungi. In exchange, the microscopic mycelial threads, which can navigate tiny soil crevices inaccessible to tree roots, supply the trees with essential water, phosphorus, and nitrogen. A single teaspoon of healthy forest soil can contain miles of these fungal filaments.",
      "More fascinatingly, this network operates as an active communication and distribution channel. If a mature tree has access to abundant sunlight, it can send surplus sugars through the mycelial network to support younger saplings growing in the shade. Furthermore, if a tree is attacked by pests, it can transmit chemical warning signals through the fungus to neighboring trees, allowing them to synthesize defensive toxins before the pests arrive.",
      "Understanding these mycelial networks shifts our perspective of the forest from a collection of competing trees to a cooperative, super-organism. Fungi are not merely decomposers; they are the connectors, neural pathways, and caretakers of the terrestrial biosphere, proving that life thrives best when connected in mutual support."
    ]
  }
];

const Blog = () => {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);

  const [posts, setPosts] = useState(BLOG_POSTS);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { supabase, isSupabaseConfigured } = await import("../../supabase");
      if (isSupabaseConfigured && supabase) {
        try {
          const { data, error } = await supabase.from("blogs").select("*");
          if (!error && data && data.length > 0) {
            // Map table fields back to component format if necessary
            // In SQL: read_time -> readTime, paragraphs -> paragraphs
            const formatted = data.map(post => ({
              ...post,
              readTime: post.read_time || post.readTime,
              content: Array.isArray(post.paragraphs) ? post.paragraphs.join("\n\n") : post.content
            }));
            setPosts(formatted);
            return;
          }
        } catch (err) {
          console.error("Supabase blogs fetch error:", err);
        }
      }
      const saved = localStorage.getItem("mock_blogs");
      if (saved) {
        setPosts(JSON.parse(saved));
      } else {
        localStorage.setItem("mock_blogs", JSON.stringify(BLOG_POSTS));
      }
    };
    fetchBlogs();
  }, []);

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = activeCategory === "all" || post.category === activeCategory;
    const matchesSearch = 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="blog-container">
      <div className="blog-inner animate__animated animate__fadeIn">
        <header className="blog-header-section">
          <span className="blog-eyebrow">Shroooms Chronicles</span>
          <h1 className="blog-title">Mycology, Science & Culinary Arts</h1>
          <p className="blog-subtitle">
            Delve into the fascinating biology of Kingdom Fungi. Read expert growing logs, scientific wellness reports, and kitchen masterclasses.
          </p>
          <div className="blog-divider"></div>
        </header>

        {/* Search & Filter Toolbar */}
        <div className="blog-toolbar">
          <div className="blog-search-wrapper">
            <i className="fa fa-search search-icon"></i>
            <input
              type="text"
              placeholder="Search articles by title or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="blog-search-input"
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery("")}>
                <i className="fa fa-times"></i>
              </button>
            )}
          </div>

          <div className="blog-filter-nav">
            <button
              className={`blog-filter-btn ${activeCategory === "all" ? "active" : ""}`}
              onClick={() => setActiveCategory("all")}
            >
              All Articles
            </button>
            <button
              className={`blog-filter-btn ${activeCategory === "science" ? "active" : ""}`}
              onClick={() => setActiveCategory("science")}
            >
              Science & Wellness
            </button>
            <button
              className={`blog-filter-btn ${activeCategory === "cultivation" ? "active" : ""}`}
              onClick={() => setActiveCategory("cultivation")}
            >
              Cultivation
            </button>
            <button
              className={`blog-filter-btn ${activeCategory === "culinary" ? "active" : ""}`}
              onClick={() => setActiveCategory("culinary")}
            >
              Culinary
            </button>
          </div>
        </div>

        {/* Blog Post Grid */}
        <div className="blog-grid">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => (
              <div key={post.id} className="blog-card">
                <div className="blog-card-header">
                  <div className="blog-icon-box">
                    <i className={`fa ${post.icon}`}></i>
                  </div>
                  <span className="blog-category-tag">{post.category.toUpperCase()}</span>
                </div>
                <h3 className="blog-card-title">{post.title}</h3>
                <p className="blog-card-summary">{post.summary}</p>
                <div className="blog-card-meta">
                  <div className="blog-author-info">
                    <span>By {post.author}</span>
                    <span className="meta-dot">•</span>
                    <span>{post.date}</span>
                  </div>
                  <span className="blog-read-time">{post.readTime}</span>
                </div>
                <button 
                  className="read-full-btn"
                  onClick={() => setSelectedArticle(post)}
                >
                  Read Full Article <i className="fa fa-long-arrow-right"></i>
                </button>
              </div>
            ))
          ) : (
            <div className="no-blogs-found">
              <i className="fa fa-book"></i>
              <p>No articles match your search query. Try searching for "Stress", "Sear", or "Substrate".</p>
            </div>
          )}
        </div>

        {/* Full Article Reader Overlay */}
        {selectedArticle && (
          <div className="article-reader-overlay animate__animated animate__fadeIn">
            <div className="article-reader-container animate__animated animate__slideInUp">
              <button 
                className="close-reader-btn"
                onClick={() => setSelectedArticle(null)}
              >
                <i className="fa fa-times"></i>
              </button>
              
              <article className="article-content">
                <header className="article-header">
                  <span className="article-category-label">{selectedArticle.category.toUpperCase()}</span>
                  <h2>{selectedArticle.title}</h2>
                  <div className="article-meta-strip">
                    <span className="author">By {selectedArticle.author}</span>
                    <span className="dot">•</span>
                    <span className="date">{selectedArticle.date}</span>
                    <span className="dot">•</span>
                    <span className="read-time">{selectedArticle.readTime}</span>
                  </div>
                  <div className="article-divider-ws"></div>
                </header>

                <div className="article-body">
                  {selectedArticle.paragraphs.map((para, idx) => (
                    <p key={idx} className={idx === 0 ? "article-intro-para" : ""}>
                      {para}
                    </p>
                  ))}
                </div>

                <footer className="article-footer">
                  <div className="author-bio-card">
                    <i className="fa fa-user-circle-o bio-icon"></i>
                    <div>
                      <h5>{selectedArticle.author}</h5>
                      <p>Contributor to Shroooms Chronicles, researching mycelial ecology and holistic dietary wellness.</p>
                    </div>
                  </div>
                  <button 
                    className="close-reader-footer-btn"
                    onClick={() => setSelectedArticle(null)}
                  >
                    Close Article
                  </button>
                </footer>
              </article>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
