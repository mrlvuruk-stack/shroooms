# SHROOOMS — Premium Gourmet Mushrooms

Welcome to **SHROOOMS**, a premium online storefront showcasing gourmet mushroom cultivars, grow guides, culinary recipes, and B2B wholesale portals. Designed with a clean, immersive, nature-inspired aesthetic, the application provides a modern and responsive user experience optimized for desktop and mobile viewports.

---

## 🌟 Features

- **Product Catalog**: Explore premium gourmet mushroom cultivars (including Premium Lion's Mane, Premium Shiitake, Traditional Reishi, Pink Oyster, and Blue Oyster) with detailed culinary facts, flavor profiles, and storage instructions.
- **Mushroom Guide**: An interactive educational guide detailing gourmet species profiles, culinary uses, growing substrates, and incubation conditions.
- **Recipes Hub**: A culinary catalog featuring high-quality recipes with portion sizes, cook times, ingredients list, and custom SEO structured JSON-LD schemas.
- **B2B Wholesale Portal**: Dedicated wholesale inquiry interface for restaurant partners and bulk buyers with synchronized double-submit locks and validation.
- **Educational Blog**: Fully responsive, SEO-optimized blog platform with structured metadata schemas, protected by Row Level Security (RLS) policies.
- **Convenience Local Cart**: Convenience cart management, updated with a safe commerce degradation banner instructing users to contact local sales channels during checkout upgrades.
- **Zero-Overflow Nature Decor**: Custom botanical visual accents dynamically aligned and clipped to guarantee zero horizontal scrollbars on desktop and mobile.
- **Supabase Backend Integration**: Remote database state hardened with custom schema security migrations, enabling Row Level Security (RLS) and strict role-based privilege controls across commerce tables.

---

## 🛠️ Tech Stack

- **Frontend**: React.js (built via optimized Create React App configuration)
- **State Management**: Redux with Redux Thunk middleware
- **Backend Integrations**: Supabase (v1 Client SDK) for products, blogs, and inquiry collection
- **Routing**: React Router Dom
- **Icons**: Font Awesome v4
- **Styling**: Vanilla CSS with modern typography (Google Fonts) and custom responsive media query breakpoints (320px to 1920px)

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm (Node Package Manager)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/mrlvuruk-stack/shroooms.git
   cd shroooms
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and configure your Supabase credentials:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_project_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Start the development server:
   ```bash
   npm start
   ```
5. Build the optimized production bundle:
   ```bash
   npm run build
   ```

---

## 🔒 Security & Verification

The database has been locked down under a hardened security posture:
- **Products Catalog**: Read-only access (`SELECT`) enabled for public anonymous sessions; database catalog mutations (`INSERT`, `UPDATE`, `DELETE`) are completely blocked.
- **Orders, Wishlists & Users**: Direct public/anon write and read privileges are fully revoked.
- **Wishlist Polling**: Disabled at the client action level to prevent unauthorized database polling loop calls.
- **Verification Suite**: Monitored using Puppeteer-based automated smoke tests verifying layout integrity, checkout warnings, blog readability, and zero network errors.

---

## 📄 License & Attribution
All recipe content, species profiles, and media resources are curated for the SHROOOMS project. Unauthorized commercial redistribution of the brand assets is prohibited.
