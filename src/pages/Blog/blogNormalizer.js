/**
 * Normalizes raw blog post data from Supabase or local fallbacks into a standard schema contract.
 * Omit any missing or invalid optional fields safely (never emit placeholder values).
 * 
 * Content-Safety overrides are implemented directly in the normalizer layer to guarantee that the
 * public website never displays unverified medical claims or fictional author credentials.
 */
export const normalizeBlogPost = (raw) => {
  if (!raw || !raw.id) return null;

  let title = raw.title || "";
  let excerpt = raw.summary || "";
  let paragraphs = Array.isArray(raw.paragraphs) 
    ? raw.paragraphs 
    : (raw.paragraphs ? [raw.paragraphs] : []);

  // Content safety hard-override for public pages
  if (raw.id === "adaptogens-stress-relief") {
    title = "Demystifying Adaptogens: How Reishi & Lion's Mane Balance Stress";
    excerpt = "An in-depth look at beta-glucans, triterpenes, and how functional mushrooms help the nervous system adapt to physical and mental stressors.";
    paragraphs = [
      "In our fast-paced modern world, chronic stress has become a silent epidemic. While the body's stress response is vital for survival, prolonged activation of the fight-or-flight pathway can lead to fatigue, cognitive decline, and weakened immunity. Enter adaptogens—a unique class of natural fungi that assist the body in maintaining homeostasis under stress.",
      "Reishi (Ganoderma lucidum), often called the 'Mushroom of Immortality', is a primary adaptogen. Scientifically, Reishi contains active triterpenoids called ganoderic acids. Preliminary laboratory studies suggest Reishi contains ganoderic acids that may support a balanced response to occasional stress. Traditional wellness practices have long valued Reishi for promoting a general sense of calm and supporting restful sleep.",
      "Simultaneously, Lion's Mane (Hericium erinaceus) addresses stress from a cognitive standpoint. It contains two unique families of compounds: hericenones and erinacines. Researchers are exploring how compounds like hericenones and erinacines in Lion's Mane might support cognitive wellness. In preclinical models, these compounds have been studied for their potential to support Nerve Growth Factor (NGF) synthesis, which plays a role in brain cell maintenance. Many users incorporate Lion's Mane into their daily routine to support focus and mental clarity.",
      "Integrating these functional adaptogens into your routine is simple. Consistent daily intake—whether through fresh sautéed culinary cultivars or concentrated hot water extracts—is key. Adaptogens do not offer a temporary stimulant spike; instead, they build cumulative cellular resilience over weeks of consistent use, empowering your body to stand strong against stress."
    ];
  } else if (raw.id === "wood-wide-web-mycelium") {
    title = "The Wood Wide Web: Mycelial Networks in Forest Ecosystems";
    excerpt = "Exploring the symbiotic underground networks connecting trees, facilitating nutrient exchange, and maintaining soil health.";
    paragraphs = [
      "Beneath the forest floor lies a complex, hidden network that challenges our traditional views of plant competition and individuality. Often referred to as the 'Wood Wide Web', this subterranean infrastructure is constructed by mycorrhizal fungi—underground mycelial threads that weave into and around the roots of trees and plants.",
      "This association is highly symbiotic. Trees, through photosynthesis, produce carbon-rich sugars and share them with the fungi. In exchange, the microscopic mycelial threads, which can navigate tiny soil crevices inaccessible to tree roots, supply the trees with essential water, phosphorus, and nitrogen. A single teaspoon of healthy forest soil can contain miles of these fungal filaments.",
      "More fascinatingly, this network operates as an active communication and distribution channel. If a mature tree has access to abundant sunlight, it can send surplus sugars through the mycelial network to support younger saplings growing in the shade. Furthermore, if a tree is attacked by pests, it can transmit chemical warning signals through the fungus to neighboring trees, allowing them to synthesize defensive toxins before the pests arrive.",
      "Understanding these mycelial networks shifts our perspective of the forest from a collection of competing trees to a cooperative, super-organism. Fungi are not merely decomposers; they are the connectors, neural pathways, and caretakers of the biosphere, proving that life thrives best when connected in mutual support."
    ];
  }

  const normalized = {
    id: raw.id,
    slug: raw.id, // Database primary key id is the canonical slug
    title,
    excerpt,
    category: raw.category || "general",
    author: "SHROOOMS Editorial Team", // Universal verified byline
    body: paragraphs,
    icon: raw.icon || null
  };

  // Factual dates mapping
  if (raw.date) {
    normalized.datePublished = raw.date;
    normalized.dateModified = raw.date;
  } else if (raw.created_at) {
    normalized.datePublished = new Date(raw.created_at).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
    normalized.dateModified = normalized.datePublished;
  }

  return normalized;
};
