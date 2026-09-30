-- ============================================================
--  SHROOOMS — Supabase All Products Setup & Seed (Version 8)
--  Paste this in Supabase: SQL Editor → New Query → Run
-- ============================================================

-- 1. Ensure Table and Columns Exist
CREATE TABLE IF NOT EXISTS public.products (
  _id          TEXT PRIMARY KEY,
  name         TEXT NOT NULL,
  category     TEXT NOT NULL,
  "categorySlug" TEXT NOT NULL,
  image        TEXT,
  price        NUMERIC NOT NULL,
  unit         TEXT,
  description  TEXT,
  benefits     TEXT,
  badge        TEXT,
  purchasing   BOOLEAN DEFAULT FALSE,
  quantity     INTEGER DEFAULT 0,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure category and categorySlug columns exist if table was already created
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS "categorySlug" TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS image TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS price NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS unit TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS benefits TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS badge TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS purchasing BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS quantity INTEGER DEFAULT 0;

-- 2. Remove the 3 Unwanted/Legacy Items
DELETE FROM public.products 
WHERE _id IN ('p6', 'p7', 'p8') 
   OR LOWER(name) IN (
     'reishi mushroom (medicinal)',
     'shiitake mushroom (organic)',
     'maitake mushroom (hen of the woods)'
   );

-- 3. Upsert All Active Products Across All 7 Categories
INSERT INTO public.products (
  _id, name, category, "categorySlug", image, price, unit, description, benefits, badge, purchasing, quantity
) VALUES
  ('spg-1', 'Bio-Cellulose Moisture Sponge', 'Sponges', 'sponges', '/prod_moisture_sponge.jpg', 199, 'Pack of 5', 'Eco-friendly high-retention bio-cellulose moisture sponge designed for humidity control in grow chambers.', '100% Biodegradable · High Moisture Retention', 'Eco Essential', false, 0),
  ('spg-2', 'High-Density Aeration Foam Sponge', 'Sponges', 'sponges', '/category_sponges.jpg', 249, 'Pack of 10', 'Autoclavable open-cell foam sponges for jar lid breathability and sterile filter plugs.', 'Sterile Plug · High Temp Safe', 'Lab Favorite', false, 0),
  ('spg-3', 'Sterile Mycelium Filter Sponge Plugs', 'Sponges', 'sponges', '/prod_moisture_sponge.jpg', 299, 'Pack of 20', 'Synthetic high-temperature filter sponges engineered for liquid culture jar lid ports.', 'Reusable 121°C · Zero Mold Contamination', 'Pro Choice', false, 0),
  ('spg-4', 'Hydrophilic Moisture Matrix Sponge Block', 'Sponges', 'sponges', '/category_sponges.jpg', 349, 'Pack of 2', 'Deep humidity reservoir sponge block that maintains constant relative humidity without standing water.', 'Continuous Humidity · Long Lasting', 'Fruiting Essential', false, 0),
  ('spg-5', 'Agar Tissue Transfer Sponge Pad', 'Sponges', 'sponges', '/category_sponges.jpg', 179, 'Pack of 12', 'Micro-porous lab sponge pads for swab wiping and sterile workspace preparation.', 'Ultra Absorbent · Lint-Free', 'Clean Room', false, 0),
  ('acc-1', 'Ultra-Fine Continuous Spray Mister', 'Accessories', 'accessories', '/category_accessories.jpg', 299, '1 Unit (300ml)', 'Provides an ultra-fine aerosol mist essential for maintaining optimal humidity for fruiting mushroom caps.', 'Continuous Spray · Fine Droplets', 'Must Have', false, 0),
  ('acc-2', 'Precision Inoculation Scalpel Set', 'Accessories', 'accessories', '/prod_scalpel.jpg', 349, '1 Handle + 10 Blades', 'Sterile stainless steel scalpel set for agar tissue transfer, cloning, and clean culture work.', 'Surgical Grade · Individually Wrapped', 'Pro Tool', false, 0),
  ('acc-3', 'Heavy-Duty Alcohol Sterilizer Lamp', 'Accessories', 'accessories', '/prod_alcohol_lamp.jpg', 399, '1 Unit + 3 Wicks', 'Glass laboratory alcohol burner lamp for flame sterilizing needles, loops, and scalpels inside Still Air Boxes.', 'Soot-Free Flame · Heat Resistant Glass', 'Lab Essential', false, 0),
  ('acc-4', 'Still Air Box (SAB) Arm Port Rings', 'Accessories', 'accessories', '/category_accessories.jpg', 499, 'Set of 2 Rings', 'Flexible silicone arm hole collars for converting plastic tubs into still-air inoculation enclosures.', 'Air Tight Seal · Easy Installation', 'DIY Lab', false, 0),
  ('acc-5', 'Stainless Steel Flame Inoculation Loop', 'Accessories', 'accessories', '/prod_scalpel.jpg', 199, 'Pack of 2', 'Nichrome metal wire loop on insulated brass handle for streak plating agar petri dishes.', 'Rapid Heat & Cool · Durable Wire', 'Microbiology', false, 0),
  ('lc-1', 'Lion''s Mane Liquid Culture Syringe', 'Liquid Culture', 'liquid-culture', '/box_lions_mane.jpg', 499, '10 ml Syringe', 'Lab-isolated Hericium erinaceus liquid mycelium broth with sterile 18G needle & alcohol pad.', 'Fast Colonizing · High Nootropic Yield', 'Top Seller', false, 0),
  ('lc-2', 'Blue Oyster Liquid Culture Syringe', 'Liquid Culture', 'liquid-culture', '/box_blue_oyster.jpg', 449, '10 ml Syringe', 'Aggressive Pleurotus ostreatus var. columbinus mycelial liquid culture syringe.', 'Vigorous Growth · Heavy Yields', 'Beginner Friendly', false, 0),
  ('lc-3', 'Pink Oyster Liquid Culture Syringe', 'Liquid Culture', 'liquid-culture', '/box_pink_oyster.jpg', 449, '10 ml Syringe', 'Tropical Pink Oyster isolated liquid culture. Fast colonizer suited for warm Indian climates.', 'Warm Climate · Fast Mycelium', 'Exotic Strain', false, 0),
  ('lc-4', 'Reishi Liquid Culture Syringe', 'Liquid Culture', 'liquid-culture', '/cultivar_reishi.jpg', 549, '10 ml Syringe', 'Ganoderma lucidum isolated liquid culture broth for medicinal conk & antler production.', 'Adaptogen Pure Strain · Lab Tested', 'Medicinal Grade', false, 0),
  ('lc-5', 'Cordyceps Militaris LC Syringe', 'Liquid Culture', 'liquid-culture', '/cultivar_cordyceps.jpg', 649, '10 ml Syringe', 'High-cordycepin strain isolated for liquid substrate broth inoculation.', 'High Active Cordycepin · Pure Genetics', 'Potent Strain', false, 0),
  ('lc-6', 'Shiitake LC Syringe (3782 Cultivar)', 'Liquid Culture', 'liquid-culture', '/category_liquid_culture.jpg', 499, '10 ml Syringe', 'Lentinula edodes high-yielding commercial cultivar LC syringe.', 'Hardwood Log & Bag Ready · Dense Caps', 'Gourmet Grade', false, 0),
  ('lc-7', 'White Oyster', 'Liquid Culture', 'liquid-culture', '/banner_pouches.jpg', 449, '10 ml Syringe', 'Pure isolated White Oyster (Pleurotus florida) liquid culture syringe. High commercial vigor with sterile 18G needle & alcohol wipe.', 'Commercial Vigor · Fast Colonizing', 'Commercial Strain', false, 0),
  ('lc-8', 'Golden Yellow Oyster', 'Liquid Culture', 'liquid-culture', '/shroooms_product_showcase.png', 499, '10 ml Syringe', 'Vibrant Golden Yellow Oyster (Pleurotus citrinopileatus) pure liquid culture syringe with sterile 18G needle & alcohol wipe.', 'Vibrant Yellow Strain · High Yield', 'Exotic Strain', false, 0),
  ('lc-9', 'Grey Oyster', 'Liquid Culture', 'liquid-culture', '/shrooom.jpg', 449, '10 ml Syringe', 'Resilient Grey Oyster (Pleurotus sajor-caju) isolated liquid culture syringe. Forgiving all-season cultivar.', 'Extremely Forgiving · Heavy Flushes', 'Commercial Favorite', false, 0),
  ('lc-10', 'King Oyster', 'Liquid Culture', 'liquid-culture', '/box_king_oyster.jpg', 549, '10 ml Syringe', 'Heavy-yielding King Oyster (Pleurotus eryngii) stem clone isolated liquid culture syringe with sterile 18G needle.', 'Gourmet Chef Choice · Dense Stems', 'Chef''s Choice', false, 0),
  ('p1', 'Lion''s Mane Mushroom (Fresh Gourmet)', 'Fresh Mushrooms', 'fresh-mushrooms', '/box_lions_mane.jpg', 499, '150 Gm', 'Premium gourmet Lion''s Mane harvested fresh at dawn. Tender seafood-like flavor when seared.', 'Harvested Fresh · Culinary Grade', 'New Arrival', false, 0),
  ('p2', 'King Oyster Mushroom (Fresh Gourmet)', 'Fresh Mushrooms', 'fresh-mushrooms', '/box_king_oyster.jpg', 349, '150 Gm', 'Dense, meaty King Oyster stems harvested fresh. Perfect for plant-based steak rounds.', 'Gourmet Culinary Excellence', 'Chef''s Choice', false, 0),
  ('p3', 'Pink Oyster Mushroom (Fresh Gourmet)', 'Fresh Mushrooms', 'fresh-mushrooms', '/box_pink_oyster.jpg', 399, '150 Gm', 'Vibrant tropical pink oyster mushroom clusters harvested fresh daily in Indore.', 'Crisp Texture · Rich Flavor', 'Rare Find', false, 0),
  ('p4', 'Blue Oyster Mushroom (Fresh Gourmet)', 'Fresh Mushrooms', 'fresh-mushrooms', '/box_blue_oyster.jpg', 399, '150 Gm', 'Artisan-grade steel blue caps with mild anise aroma preferred by gourmet chefs.', 'Tender Caps · Unique Flavor', 'Best Seller', false, 0),
  ('p5', 'Golden Oyster Mushroom (Fresh Gourmet)', 'Fresh Mushrooms', 'fresh-mushrooms', '/category_fresh_mushrooms.jpg', 429, '150 Gm', 'Sunshine yellow caps with subtle cashew nutty notes, grown on hardwood sawdust.', 'Nutty Notes · Vibrant Color', 'Exotic Bloom', false, 0),
  ('fm-elm', 'Elm Oyster Mushroom (Fresh Gourmet)', 'Fresh Mushrooms', 'fresh-mushrooms', '/category_fresh_mushrooms.jpg', 349, '150 Gm', 'Fleshy white caps with firm texture that hold up brilliantly in stir fries and curries.', 'Fleshy Texture · Versatile Cook', 'Farm Harvest', false, 0),
  ('fm-chestnut', 'Chestnut Mushroom (Fresh Gourmet)', 'Fresh Mushrooms', 'fresh-mushrooms', '/category_fresh_mushrooms.jpg', 479, '150 Gm', 'Crunchy bronze caps with a rich nutty flavor that stays snappy after roasting.', 'Nutty & Snap Crunch · High Antioxidant', 'Gourmet Special', false, 0),
  ('dr-1', 'Dried Shiitake Mushrooms (Whole Caps)', 'Dried Mushrooms', 'dried-mushrooms', '/category_dried_mushrooms.jpg', 399, '100 Gm', 'Sun-dried premium Shiitake caps. Rehydrates into intense umami broth for ramen and stews.', 'Deep Umami · Long Shelf Life', 'Pantry Favorite', false, 0),
  ('dr-2', 'Dried Reishi Mushroom Slices', 'Dried Mushrooms', 'dried-mushrooms', '/cultivar_reishi.jpg', 599, '100 Gm', 'Sliced organic Red Reishi conks ready for brewing immunity-boosting herbal teas.', 'Immune Support · Pure Brew', 'Wellness Choice', false, 0),
  ('dr-3', 'Dried Cordyceps Militaris Fruitbodies', 'Dried Mushrooms', 'dried-mushrooms', '/cultivar_cordyceps.jpg', 999, '25 Gm', 'Lab-cultivated vibrant orange Cordyceps strands rich in adenosine and cordycepin.', 'Cellular Energy · VO2 Stamina', 'Superfood', false, 0),
  ('dr-4', 'Dried Lion''s Mane Powder (Nootropic)', 'Dried Mushrooms', 'dried-mushrooms', '/box_lions_mane.jpg', 699, '100 Gm', 'Pure 100% Lion''s Mane fruitbody powder. Stir into morning coffee or smoothie for focus.', 'Brain Focus · 100% Pure Fruitbody', 'Nootropic', false, 0),
  ('dr-5', 'Dried Chaga Mushroom Tea Chunks', 'Dried Mushrooms', 'dried-mushrooms', '/category_dried_mushrooms.jpg', 799, '150 Gm', 'Wild harvested Siberian Chaga conk chunks rich in SOD antioxidants for daily tea infusion.', 'Antioxidant Powerhouse · Low Acidity', 'Wild Harvest', false, 0),
  ('spn-1', 'Blue Oyster Grain Spawn', 'Spawn', 'spawn', '/box_blue_oyster.jpg', 399, '1 kg Bag', '100% fully colonized organic grain spawn ready for inoculating straw or sawdust substrate.', 'Fast Colonizing · High Yield', 'Grower Favorite', false, 0),
  ('spn-2', 'Pink Oyster Grain Spawn', 'Spawn', 'spawn', '/box_pink_oyster.jpg', 399, '1 kg Bag', 'High-vigor tropical Pink Oyster grain spawn ideal for warm climate cultivation.', 'Warm Climate · Rapid Flush', 'Fast Crop', false, 0),
  ('spn-3', 'Lion''s Mane Grain Spawn', 'Spawn', 'spawn', '/box_lions_mane.jpg', 499, '1 kg Bag', 'Premium Hericium erinaceus grain spawn for hardwood substrate bags.', 'Nootropic Strain · Heavy Pinning', 'Gourmet Strain', false, 0),
  ('spn-4', 'King Oyster Grain Spawn', 'Spawn', 'spawn', '/box_king_oyster.jpg', 449, '1 kg Bag', 'Pleurotus eryngii master grain spawn for thick stem commercial block production.', 'Meaty Stems · Dense Mycelium', 'Commercial Grade', false, 0),
  ('spn-5', 'White Oyster Grain Spawn', 'Spawn', 'spawn', '/category_spawn.jpg', 349, '1 kg Bag', 'Pleurotus florida commercial strain grain spawn. High environmental tolerance.', 'High Flush Yield · Easy Cultivation', 'All-Season', false, 0),
  ('spn-6', 'Reishi Grain Spawn', 'Spawn', 'spawn', '/cultivar_reishi.jpg', 499, '1 kg Bag', 'Ganoderma lucidum grain spawn for hardwood log inoculation and antler grow bags.', 'Medicinal Grade · Dense Colonizer', 'Adaptogen', false, 0),
  ('spn-7', 'Blue Oyster', 'Spawn', 'spawn', '/box_blue_oyster.jpg', 399, '1 kg Bag', 'Vibrant ocean-blue clusters known for high yields, tender texture, and mild earthy flavor. Rapid colonization on grain.', 'Fast Colonizing · High Yield', 'Grower Favorite', false, 0),
  ('spn-8', 'Pink Oyster', 'Spawn', 'spawn', '/box_pink_oyster.jpg', 399, '1 kg Bag', 'Striking tropical pink bouquet clusters. Extremely fast colonizer perfectly suited for warm Indian climate conditions.', 'Warm Climate · Rapid Flush', 'Fast Crop', false, 0),
  ('spn-9', 'Elm Oyster', 'Spawn', 'spawn', '/category_fresh_mushrooms.jpg', 349, '1 kg Bag', 'Robust white to cream colored caps with thick stems. Highly resistant to green mold contamination with dependable yields.', 'Contamination Resistant · All-Season', 'Resilient Strain', false, 0),
  ('spn-10', 'White Oyster', 'Spawn', 'spawn', '/category_spawn.jpg', 349, '1 kg Bag', 'Classic commercial white oyster cultivar. Soft fleshy caps, pleasant aroma, and dependable commercial yields.', 'High Flush Yield · Easy Cultivation', 'All-Season', false, 0),
  ('spn-11', 'Golden Yellow Oyster', 'Spawn', 'spawn', '/shroooms_product_showcase.png', 399, '1 kg Bag', 'Bright sunshine-yellow clusters with fragrant nutty, cashewnut-like aroma upon cooking. Rapid grain colonizer.', 'Vibrant Color · Exotic Gourmet', 'Exotic Strain', false, 0),
  ('spn-12', 'Grey Oyster', 'Spawn', 'spawn', '/shrooom.jpg', 349, '1 kg Bag', 'India''s most popular commercial cultivation variety. Broad grey-brown caps with incredible environmental adaptability.', 'Commercial Benchmark · High Adaptability', 'Commercial Favorite', false, 0),
  ('spn-13', 'King Oyster', 'Spawn', 'spawn', '/box_king_oyster.jpg', 449, '1 kg Bag', 'Thick meaty stems with rich umami flavor. The king of culinary mushrooms, prized by fine dining chefs.', 'Meaty Stems · Dense Mycelium', 'Chef''s Choice', false, 0),
  ('tool-1', 'PP Bags with 0.2 Micron Filter Patch', 'Tools & Accessories', 'tools-accessories', '/prod_filter_bags.jpg', 399, 'Pack of 50 Bags', 'Heavy-duty autoclavable polypropylene grow bags with breathable gas-exchange filter patch.', 'Autoclavable 121°C · Mold Shield', 'Commercial Spec', false, 0),
  ('tool-2', 'Digital Thermo-Hygrometer Monitor', 'Tools & Accessories', 'tools-accessories', '/prod_hygrometer.jpg', 499, '1 Unit', 'High-precision digital gauge for measuring grow tent temperature & relative humidity.', 'LCD Display · Dual Sensor Probe', 'Precision Gear', false, 0),
  ('tool-3', 'Agricultural Gypsum pH Buffer Powder', 'Tools & Accessories', 'tools-accessories', '/category_tools_accessories.jpg', 149, '900 Gm', 'Fine Calcium Sulfate powder to prevent grain clumping and enrich substrate minerals.', 'Anti-Clump · Mineral Source', 'Substrate Additive', false, 0),
  ('tool-4', 'Hydrated Lime Cold Pasteurizer Powder', 'Tools & Accessories', 'tools-accessories', '/category_tools_accessories.jpg', 199, '1 kg Bag', 'Low-magnesium Calcium Hydroxide for cold water straw pasteurization without heat.', 'Heat-Free Sterilization · Fast Soak', 'Straw Master', false, 0),
  ('tool-5', 'Sterile Agar Petri Dishes with Parafilm', 'Tools & Accessories', 'tools-accessories', '/category_tools_accessories.jpg', 349, 'Pack of 10 Dishes', 'Pre-poured sterile Malt Yeast Extract Agar (MYEA) petri dishes ready for tissue cloning.', 'Sterile Sealed · High Clarity', 'Lab Ready', false, 0),
  ('tool-6', 'Autoclavable Self-Healing Injection Ports', 'Tools & Accessories', 'tools-accessories', '/category_tools_accessories.jpg', 249, 'Pack of 50 Ports', '20mm heavy silicone self-healing injection ports for liquid culture jar lids.', '100+ Syringe Punctures · High Temp Safe', 'Jar Mod', false, 0)
ON CONFLICT (_id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  "categorySlug" = EXCLUDED."categorySlug",
  image = EXCLUDED.image,
  price = EXCLUDED.price,
  unit = EXCLUDED.unit,
  description = EXCLUDED.description,
  benefits = EXCLUDED.benefits,
  badge = EXCLUDED.badge,
  purchasing = EXCLUDED.purchasing,
  quantity = EXCLUDED.quantity;

-- 4. Enable Row Level Security (RLS) & Grant Read Privileges
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'products' AND policyname = 'Allow public read access on products'
  ) THEN
    CREATE POLICY "Allow public read access on products" 
    ON public.products 
    FOR SELECT 
    USING (true);
  END IF;
END $$;

GRANT SELECT ON public.products TO anon, authenticated;

-- ============================================================
-- Verification Query
-- ============================================================
SELECT category, COUNT(*) as total_items 
FROM public.products 
GROUP BY category 
ORDER BY total_items DESC;
