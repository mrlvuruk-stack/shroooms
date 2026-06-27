-- ============================================================
--  SHROOOMS — Supabase setup version 2 (Content Database)
--  Paste this in: SQL Editor → New Query → Run
-- ============================================================

-- ── 1. Create Tables (skip if already exist) ──

-- Health Benefits Table
CREATE TABLE IF NOT EXISTS public.benefits (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  scientific_name TEXT,
  category        TEXT NOT NULL,
  icon            TEXT DEFAULT 'fa-lightbulb-o',
  summary         TEXT,
  compounds       JSONB DEFAULT '[]',
  details         JSONB DEFAULT '[]',
  color           TEXT DEFAULT '#e6dfd1',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Recipes Table
CREATE TABLE IF NOT EXISTS public.recipes (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  mushroom        TEXT NOT NULL,
  category        TEXT NOT NULL,
  time            TEXT,
  difficulty      TEXT DEFAULT 'Easy',
  icon            TEXT DEFAULT 'fa-cutlery',
  summary         TEXT,
  ingredients     JSONB DEFAULT '[]',
  steps           JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Wholesale Table
CREATE TABLE IF NOT EXISTS public.wholesale (
  id              TEXT PRIMARY KEY,
  name            TEXT NOT NULL,
  packaging       TEXT,
  suitability     TEXT,
  description     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
  id              TEXT PRIMARY KEY,
  title           TEXT NOT NULL,
  category        TEXT NOT NULL,
  author          TEXT,
  date            TEXT,
  read_time       TEXT,
  icon            TEXT,
  summary         TEXT,
  paragraphs      JSONB DEFAULT '[]',
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Contact Table
CREATE TABLE IF NOT EXISTS public.contact (
  id              TEXT PRIMARY KEY,
  address         TEXT,
  phone           TEXT,
  email           TEXT,
  support_hours   TEXT,
  helpline_hours  TEXT,
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ── 2. Enable Row Level Security (RLS) ──
ALTER TABLE public.benefits  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wholesale ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact   ENABLE ROW LEVEL SECURITY;

-- ── 3. Drop existing policies if they exist (safe re-run) ──
DROP POLICY IF EXISTS "Public read benefits"  ON public.benefits;
DROP POLICY IF EXISTS "Public write benefits" ON public.benefits;
DROP POLICY IF EXISTS "Public read recipes"   ON public.recipes;
DROP POLICY IF EXISTS "Public write recipes"  ON public.recipes;
DROP POLICY IF EXISTS "Public read wholesale" ON public.wholesale;
DROP POLICY IF EXISTS "Public write wholesale" ON public.wholesale;
DROP POLICY IF EXISTS "Public read blogs"     ON public.blogs;
DROP POLICY IF EXISTS "Public write blogs"    ON public.blogs;
DROP POLICY IF EXISTS "Public read contact"   ON public.contact;
DROP POLICY IF EXISTS "Public write contact"  ON public.contact;

-- ── 4. Create Policies ──
CREATE POLICY "Public read benefits"  ON public.benefits FOR SELECT USING (true);
CREATE POLICY "Public write benefits" ON public.benefits FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "Public read recipes"   ON public.recipes  FOR SELECT USING (true);
CREATE POLICY "Public write recipes"  ON public.recipes  FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "Public read wholesale" ON public.wholesale FOR SELECT USING (true);
CREATE POLICY "Public write wholesale" ON public.wholesale FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "Public read blogs"     ON public.blogs    FOR SELECT USING (true);
CREATE POLICY "Public write blogs"    ON public.blogs    FOR ALL    USING (true) WITH CHECK (true);
CREATE POLICY "Public read contact"   ON public.contact  FOR SELECT USING (true);
CREATE POLICY "Public write contact"  ON public.contact  FOR ALL    USING (true) WITH CHECK (true);

-- ── 5. Seed Default Data ──

-- Seed Benefits
INSERT INTO public.benefits (id, name, scientific_name, category, icon, summary, compounds, details, color) VALUES
('lions-mane', 'Lion''s Mane', 'Hericium erinaceus', 'brain', 'fa-lightbulb-o', 'The ultimate natural cognitive enhancer supporting neurogenesis and mental clarity.', '["Hericenones", "Erinacines", "Beta-Glucans"]', '["Stimulates Nerve Growth Factor (NGF) synthesis, critical for brain health and memory retention.", "Improves focus, concentration, and cognitive speed by supporting myelin sheath health.", "Reduces mild symptoms of anxiety and brain fog, promoting emotional balance."]', '#e6dfd1'),
('reishi', 'Reishi', 'Ganoderma lucidum', 'immunity', 'fa-shield', 'The ''Mushroom of Immortality'' known for deep stress relief, sleep, and immune defense.', '["Ganoderic Acids", "Triterpenes", "Polysaccharides"]', '["Acts as a powerful adaptogen that modulates the adrenal system to reduce stress hormones.", "Enhances deep sleep cycles (REM sleep) by calming the central nervous system.", "Supports natural killer (NK) cell activity, enhancing the body''s immune surveillance."]', '#d96f7c'),
('cordyceps', 'Cordyceps', 'Cordyceps militaris', 'energy', 'fa-bolt', 'Natural athletic booster that optimizes oxygen delivery and cellular energy production.', '["Cordycepin", "Adenosine", "Polysaccharides"]', '["Increases ATP (adenosine triphosphate) production, the primary fuel for muscle cells.", "Optimizes VO2 max (maximum oxygen intake) to reduce fatigue during exertion.", "Supports respiratory health by using raw functional mushrooms to improve pulmonary function."]', '#dcae1d')
ON CONFLICT (id) DO NOTHING;

-- Seed Recipes
INSERT INTO public.recipes (id, name, mushroom, category, time, difficulty, icon, summary, ingredients, steps) VALUES
('lions-mane-steaks', 'Pan-Seared Lion''s Mane Steaks', 'Lion''s Mane', 'main', '20 mins', 'Easy', 'fa-cutlery', 'Thick-cut Lion''s Mane steaks seared to golden perfection in herb-infused garlic butter.', '["250g fresh Lion''s Mane mushroom", "2 tbsp unsalted butter (or vegan alternative)", "3 garlic cloves, crushed", "2 sprigs fresh rosemary", "Coarse sea salt & cracked black pepper to taste"]', '["Slice the Lion''s Mane mushroom into 1-inch thick slabs.", "Heat a dry cast-iron skillet over medium-high heat. Place the mushroom slabs in the pan and sear for 2-3 minutes, using a heavy press or second pan to compress out excess moisture.", "Lower the heat to medium. Add butter, crushed garlic, and rosemary sprigs to the skillet.", "Tilt the pan and baste the melted butter over the steaks continuously for 4-5 minutes until golden brown and caramelized.", "Season generously with sea salt and black pepper. Serve hot."]'),
('king-oyster-scallops', 'King Oyster Mushroom ''Scallops''', 'King Oyster', 'main', '25 mins', 'Medium', 'fa-glass', 'Thick rounds of King Oyster stems scored, seared, and glazed in white wine and soy sauce.', '["3 large King Oyster mushroom stems", "1.5 tbsp olive oil", "1 tbsp butter", "1 tbsp soy sauce", "2 tbsp dry white wine", "1 sprig fresh thyme"]', '["Slice the mushroom stems into 1-inch rounds. Score a crosshatch pattern on both flat sides of each round.", "Heat olive oil in a skillet over high heat. Add the mushroom rounds scored-side down.", "Sear for 3 minutes on each side until a deep golden crust forms.", "Reduce heat to medium. Deglaze the pan with white wine and soy sauce.", "Add butter and thyme. Baste the scallops in the pan glaze for 2 minutes until tender and juicy. Plate immediately."]'),
('pink-oyster-tacos', 'Crispy Pink Oyster Tacos', 'Pink Oyster', 'quick', '15 mins', 'Easy', 'fa-lemon-o', 'Vibrant shredded Pink Oyster clusters pan-fried till crispy and served in warm tortillas.', '["200g Pink Oyster mushrooms", "1 tbsp taco seasoning mix", "1 tbsp lime juice", "4 small corn tortillas", "1 cup shredded red cabbage", "1 ripe avocado, sliced"]', '["Tear the pink oyster mushroom clusters into bite-sized shreds.", "Sauté in a dry non-stick skillet over medium-high heat for 3-4 minutes to release moisture.", "Add olive oil and taco seasoning. Sauté for another 5 minutes until edges are crisp and golden.", "Squeeze fresh lime juice over the mushrooms and toss.", "Warm the tortillas. Assemble with cabbage, shredded mushrooms, and fresh avocado slices."]'),
('blue-oyster-pasta', 'Creamy Blue Oyster Linguine', 'Blue Oyster', 'main', '30 mins', 'Medium', 'fa-cutlery', 'Silky linguine tossed in a rich, garlic-shallot cream sauce with sautéed Blue Oyster mushrooms.', '["200g Blue Oyster mushrooms, sliced", "150g linguine pasta", "1/2 cup heavy cream (or thick coconut cream)", "1/2 shallot, finely chopped", "2 garlic cloves, minced", "1/4 cup grated parmesan cheese"]', '["Cook linguine in salted boiling water according to package instructions. Reserve 1/4 cup pasta water.", "Sauté chopped shallots and minced garlic in olive oil until soft.", "Add sliced blue oyster mushrooms. Sauté for 6-8 minutes until browned.", "Pour in heavy cream and bring to a gentle simmer for 2 minutes.", "Toss in cooked linguine, parmesan cheese, and reserved pasta water. Stir until glossy and coated. Garnish with parsley."]')
ON CONFLICT (id) DO NOTHING;

-- Seed Wholesale Offerings
INSERT INTO public.wholesale (id, name, packaging, suitability, description) VALUES
('bulk-lions-mane', 'Fresh Lion''s Mane (Bulk)', '5kg / 10kg insulated crates', 'Fine Dining, Apothecary Extractors, Grocers', 'Hand-picked daily, dense clusters with clean icicle spines. Shipped in temperature-controlled boxes.'),
('bulk-king-oyster', 'Chef Grade King Oyster (Bulk)', '5kg / 10kg boxes', 'culinary Chefs, High-end Vegan Restaurants', 'Thick, firm, clean stems with minimal cap taper. Ideal for scoring, grilling, and meat-replacements.'),
('bulk-oyster-mix', 'Oyster Medley (Pink, Blue & Gold)', '3kg / 5kg ventilated trays', 'Boutique Grocers, Weekly Farm Markets', 'A visually striking assortment of fresh Pink, Blue, and Golden Oyster mushroom clusters.'),
('bulk-substrate-blocks', 'Fruiting Substrate Blocks (Palletized)', 'Sterilized hardwood oak blocks (minimum 50 units)', 'Urban Farms, Commercial Growers', 'Fully colonized, premium grain-fed mycelium blocks ready for pinning. Tested for high yield strains.')
ON CONFLICT (id) DO NOTHING;

-- Seed Blogs
INSERT INTO public.blogs (id, title, category, author, date, read_time, icon, summary, paragraphs) VALUES
('adaptogens-stress-relief', 'Demystifying Adaptogens: How Reishi & Lion''s Mane Balance Stress', 'science', 'Dr. Elena Rostova', 'June 18, 2026', '5 min read', 'fa-flask', 'An in-depth look at beta-glucans, triterpenes, and how functional mushrooms help the nervous system adapt to physical and mental stressors.', '["In our fast-paced modern world, chronic stress has become a silent epidemic. While the body''s stress response is vital for survival, prolonged activation of the fight-or-flight pathway can lead to fatigue, cognitive decline, and weakened immunity. Enter adaptogens—a unique class of natural fungi that assist the body in maintaining homeostasis under stress.", "Reishi (Ganoderma lucidum), often called the ''Mushroom of Immortality'', is a primary adaptogen. Scientifically, Reishi contains active triterpenoids called ganoderic acids. These compounds have been shown in laboratory studies to bind to pathways in the central nervous system, calming neuronal excitability and modulating the adrenal response to lower cortisol levels. Many users report improved sleep quality and a feeling of groundedness after regular consumption.", "Simultaneously, Lion''s Mane (Hericium erinaceus) addresses stress from a cognitive standpoint. It contains two unique families of compounds: hericenones and erinacines. These low-molecular-weight molecules cross the blood-brain barrier to stimulate the synthesis of Nerve Growth Factor (NGF). By encouraging the growth, maintenance, and repair of brain cells, Lion''s Mane helps mitigate the neuro-inflammatory markers associated with chronic stress, improving mental clarity and reducing ''brain fog''.", "Integrating these functional adaptogens into your routine is simple. Consistent daily intake—whether through fresh sautéed culinary cultivars or concentrated hot water extracts—is key. Adaptogens do not offer a temporary stimulant spike; instead, they build cumulative cellular resilience over weeks of consistent use, empowering your body to stand strong against stress."]'),
('dry-sear-culinary-science', 'Culinary Masterclass: The Science of the Dry Sear', 'culinary', 'Chef Sanjay Kapoor', 'May 24, 2026', '4 min read', 'fa-cutlery', 'Why dry-searing mushrooms in a piping hot skillet before adding butter or oils yields the best texture and maximizes caramelization.', '["For years, standard culinary school advice suggested melting butter or heating oil in a pan before adding mushrooms. However, if you''ve ever cooked mushrooms this way, you''ve likely noticed a common issue: they immediately absorb the fat like tiny sponges, turn soggy, and then release a pool of water, leaving them boiling in their own juices rather than browning.", "The science of mushroom structure explains this. Mushrooms are roughly 85% to 92% water, and their cell walls are made of chitin (a tough polymer also found in the shells of crustaceans) rather than cellulose. chitin does not break down easily under heat, meaning mushrooms can withstand high temperatures without turning mushy. To get a perfect brown sear, we must first collapse these cell walls and evaporate the internal moisture.", "The dry sear method is simple. Place your sliced mushrooms into a hot, completely dry cast-iron or stainless steel skillet over medium-high heat. Do not add oil, butter, or salt. Spread them in a single layer. Within 2-3 minutes, you will hear a loud sizzling as the mushrooms begin to steam and shrink, releasing their cell-bound water.", "Continue cooking for another 3-4 minutes, letting the liquid evaporate. Once the pan is dry again and the edges of the mushrooms start to take on a golden color, it''s time to add your fat—butter, olive oil, or ghee—along with minced garlic, shallots, and fresh herbs. The mushrooms, now deflated and partially cooked, will no longer absorb excessive grease. Instead, the fat will coat the outside, crisping the edges and triggering the Maillard reaction for an incredibly rich, caramelized umami flavor."]'),
('substrate-growing-efficiency', 'Substrate Selection: Hardwood vs. Agricultural Byproducts', 'cultivation', 'Aarav Sharma (Head Grower)', 'April 12, 2026', '7 min read', 'fa-pagelines', 'How choosing sawdust, wheat bran, or agricultural straw changes colonization rates and biological efficiency in commercial mushroom farms.', '["In commercial mushroom cultivation, the media on which your mycelium feeds—known as the substrate—is the single most critical factor determining your crop''s yield, speed, and nutritional content. Unlike plants that rely on soil and photosynthesis, mushrooms are saprotrophic, meaning they secrete enzymes to decompose complex organic matter for food.", "Wood-decay fungi like Lion''s Mane, Shiitake, and Oyster mushrooms naturally decompose lignin and cellulose found in trees. In our automated greenhouse, we replicate this by using sterilized hardwood sawdust (primarily oak or maple) as our base substrate. However, sawdust alone lacks the high nitrogen levels required to produce heavy, dense fruiting bodies.", "To solve this, we practice ''substrate formulation'' by adding organic agricultural byproducts. We blend the sawdust with wheat bran at a ratio of 80% wood to 20% bran. The wheat bran acts as a nutritional supplement, providing nitrogen, vitamins, and minerals that boost the biological efficiency (the ratio of fresh mushroom weight to dry substrate weight) from a meager 40% to over 100%.", "Other farms use agricultural straw (like wheat or paddy straw) which is pasteurized rather than sterilized. Straw is cheaper and excellent for fast-growing Oyster mushrooms, but it doesn''t support the slower, wood-loving species like Shiitake or Reishi. By sourcing organic, local hardwood and grain byproducts, we ensure Shroooms'' crops grow in a premium, chemical-free environment, yielding the highest concentrations of active health compounds."]'),
('wood-wide-web-mycelium', 'The Wood Wide Web: Mycelial Networks in Forest Ecosystems', 'science', 'Dr. Elena Rostova', 'March 29, 2026', '6 min read', 'fa-globe', 'Exploring the symbiotic underground networks connecting trees, facilitating nutrient exchange, and maintaining soil health.', '["Beneath the forest floor lies a complex, hidden network that challenges our traditional views of plant competition and individuality. Often referred to as the ''Wood Wide Web'', this subterranean infrastructure is constructed by mycorrhizal fungi—underground mycelial threads that weave into and around the roots of trees and plants.", "This association is highly symbiotic. Trees, through photosynthesis, produce carbon-rich sugars and share them with the fungi. In exchange, the microscopic mycelial threads, which can navigate tiny soil crevices inaccessible to tree roots, supply the trees with essential water, phosphorus, and nitrogen. A single teaspoon of healthy forest soil can contain miles of these fungal filaments.", "More fascinatingly, this network operates as an active communication and distribution channel. If a mature tree has access to abundant sunlight, it can send surplus sugars through the mycelial network to support younger saplings growing in the shade. Furthermore, if a tree is attacked by pests, it can transmit chemical warning signals through the fungus to neighboring trees, allowing them to synthesize defensive toxins before the pests arrive.", "Understanding these mycelial networks shifts our perspective of the forest from a collection of competing trees to a cooperative, super-organism. Fungi are not merely decomposers; they are the connectors, neural pathways, caretakers of the biosphere, proving that life thrives best when connected in mutual support."]')
ON CONFLICT (id) DO NOTHING;

-- Seed Contact
INSERT INTO public.contact (id, address, phone, email, support_hours, helpline_hours) VALUES
('coordinates', '77, Phoenix Township, Kelod Hala, Dewas Naka, Indore, Madhya Pradesh, India', '+91 92389 09365', 'customar@shrooom.in', 'Fruiting Chamber misting cycles run hourly. Offices closed on National Holidays.', 'Mon - Sat, 8:00 AM - 6:00 PM')
ON CONFLICT (id) DO NOTHING;
