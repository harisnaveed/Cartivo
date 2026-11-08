<div align="center">

# 🛒 Cartivo

**Manage smarter. Trade seamlessly. Grow with clarity.**  
*A modern marketplace & back-office inventory platform built with Node.js, Express 5, MongoDB, Mongoose, and EJS.*

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.3-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_v9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![Session Auth](https://img.shields.io/badge/Auth-Session_%26_Bcrypt-blueviolet?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://github.com/expressjs/session)
[![EJS](https://img.shields.io/badge/Templates-EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)](https://ejs.co/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-CDN-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

<br />

[System Overview](#-system-overview) •
[Key Features](#-key-features) •
[How It Works](#-how-the-system-works) •
[Architecture & Tech Stack](#-architecture--technology-stack) •
[Project Structure](#-project-structure) •
[Routes & Endpoints](#-routes--navigation) •
[Database Schemas & Persistence](#-database-schemas--data-models) •
[Default Admin Accounts](#-default-admin-accounts) •
[Quick Start & CLI Commands](#-quick-start--cli-commands)

---

</div>

## 📖 System Overview

**Cartivo** is a production-ready, full-stack web application that combines a customer-facing marketplace with an isolated administrative back-office portal. Designed with a Scandinavian minimalist aesthetic and ambient 3D floating clay elements, Cartivo provides a cohesive experience for browsing, searching, quick-previewing products, submitting business inquiries, and managing catalog inventory.

The application follows an **ES Module (ESM)** architecture featuring strict separation of concerns:
- **Storefront Layer (Public)**: Public routes (`/`), customer browsing, server-side search (`$regex`), category filters, interactive modals, client-side cart state (`localStorage`), and JSON-based lead capture.
- **Back-Office Layer (Admin)**: Isolated admin portal (`/admin`), session-based authentication (`express-session` + `connect-mongo`), bcrypt password hashing, gatekeeper route protection middlewares, executive KPI metrics dashboard, tabular product and category CRUD with image uploads, and referential integrity protection.

---

## ✨ Key Features

### 🛍️ Storefront & Customer Experience
- **Interactive Category Slider**: Homepage carousel featuring drag-to-scroll, touch swipe, smooth momentum, and auto-disabling navigation arrow controls.
- **Dynamic Search & Filtering**: Multi-criteria search via server-side `$regex` and category filtering via slug query parameters (`/shop?search=...&category=...`), complemented by instant client-side search filtering.
- **Modular Product Cards**: Card component featuring image hover scaling, formatted currency, condition tags, stock indicator dots, and quick-view modal triggers.
- **Interactive Quick View Modal**: Modal overlay displaying full product specifications, stock availability, and dynamic cart insertion without page reloads.
- **Client-Side Cart with LocalStorage**: Persistent cart state tracking item count and cart badges across views.
- **SEO-Friendly Slugs**: Human-readable URLs (`/product/:slug/view`) generated automatically with `slugify`.
- **Global Contact & Leads System**: Inquiry intake form with phone and topic selection, paired with interactive Google Maps and office visit details. Lead inquiries are logged to `data/leads.json` with timestamped tracking.

### 🛡️ Back-Office Portal & Security
- **Session-Based Authentication & Route Guarding**:
  - Full protection of `/admin/*` routes via `requireAdminAuth` and `redirectIfAuthenticated` middlewares.
  - Unauthenticated guests are automatically redirected to `/admin/login`, preserving the requested URL for a seamless post-login redirect.
  - Persistent server sessions stored in MongoDB (`connect-mongo`), ensuring administrators stay logged in across server/nodemon restarts.
  - Security cookie flags: `httpOnly: true` (XSS defense), `sameSite: "lax"` (CSRF protection), 24-hour expiration.
- **Bcrypt Password Hashing**: Passwords stored as 60-character bcrypt hash strings with 10 salt rounds. Schemas include automated `pre("save")` hooks and `comparePassword()` helper methods.
- **Executive Metric Cards**: Real-time counters showing total catalog products, active categories, active items, and low-stock alerts (< 5 units).
- **Product Inventory Hub (`/admin/products`)**:
  - Administrative table with thumbnails, populated category relationships, pricing, stock alerts, and status badges.
  - Multipart image uploads via Multer (2 MB limit, MIME validation).
  - Automated filesystem cleanup: deleting or updating a product automatically unlinks and removes old images from disk (`public/uploads/`).
- **Category & Taxonomy Management (`/admin/categories`)**:
  - Full CRUD with instant search filtering.
  - **Referential Integrity Protection**: Prevents deleting categories that currently have products assigned to them to avoid orphaned inventory records.
  - **Device & Hardware Icon Catalog**: Interactive icon picker featuring 35+ FontAwesome device icons with live search and category filter tabs (`Computers`, `Mobile & Watch`, `Audio & Sound`, `Gaming & Video`, `Hardware & Parts`, `Smart Home & IoT`).
- **Admin Asset Isolation**:
  - Dedicated admin stylesheet (`public/css/admin/style.css`).
  - Dedicated admin script engine (`public/js/admin/admin.js`) for mobile sidebar drawer toggling, live table search, and icon/image previews.
  - Dedicated admin view partials (`views/admin/partials/`).

---

## ⚙️ How the System Works

```mermaid
flowchart TD
    Client["Browser / Client"]

    subgraph Server["Express 5 Web Server (app.js & server.js)"]
        Router{"Route Dispatcher"}
        SessionMiddleware["Session & Cookie Engine (express-session + connect-mongo)"]
        AuthMiddleware["Admin Auth Guard (adminAuth.js)"]
        Multer["Upload Engine (config/multer.js)"]
        
        subgraph AdminControllers["Admin Controllers (admin/controllers/)"]
            AdminCtrl["adminController.js (Dashboard, Login, Logout)"]
            AdminProdCtrl["adminProductController.js (Product CRUD)"]
            AdminCatCtrl["adminCategoryController.js (Category CRUD)"]
        end

        subgraph StorefrontControllers["Storefront Controllers (controllers/)"]
            PublicProd["productController.js (Home, Shop, Details)"]
            PublicCat["categoryController.js (Categories API)"]
            PublicContact["contactController.js (Leads Intake)"]
        end
    end

    subgraph DataStorage["Persistence Layer"]
        MongoDB[("MongoDB Database (cartivo)")]
        SessionCol[("MongoDB: sessions collection")]
        Uploads[("public/uploads/ (Local Product Images)")]
        LeadsFile[("data/leads.json (Contact Leads)")]
    end

    subgraph ViewsLayer["Presentation Layer (EJS)"]
        AdminViews["Admin Views (views/admin/)<br/>dashboard, login, products, categories"]
        StoreViews["Storefront Views (views/)<br/>home, shop, product-details, contact, about, 404"]
    end

    Client -->|HTTP Requests| SessionMiddleware
    SessionMiddleware <-->|Read / Write Sessions| SessionCol
    SessionMiddleware --> Router

    Router -->|/admin/login| AdminCtrl
    Router -->|/admin/* (Protected)| AuthMiddleware
    AuthMiddleware -->|Authenticated| AdminCtrl
    AuthMiddleware -->|Authenticated| AdminProdCtrl
    AuthMiddleware -->|Authenticated| AdminCatCtrl
    AuthMiddleware -->|Unauthenticated Guest| RedirectLogin["302 Redirect to /admin/login"]

    Router -->|Public Storefront Routes| PublicProd
    Router -->|Contact Form POST| PublicContact

    AdminProdCtrl -->|Multipart Upload| Multer
    Multer -->|Store File| Uploads
    AdminProdCtrl -->|Unlink Image on Delete| Uploads

    AdminCtrl <-->|Mongoose ODM| MongoDB
    AdminProdCtrl <-->|Mongoose ODM| MongoDB
    AdminCatCtrl <-->|Mongoose ODM| MongoDB
    PublicProd <-->|Mongoose ODM| MongoDB
    PublicContact -->|Append Lead| LeadsFile

    AdminCtrl --> AdminViews
    AdminProdCtrl --> AdminViews
    AdminCatCtrl --> AdminViews
    PublicProd --> StoreViews
    RedirectLogin --> Client
    AdminViews --> Client
    StoreViews --> Client
```

---

## 🛠 Architecture & Technology Stack

| Layer | Technology | Version | Purpose |
| :--- | :--- | :--- | :--- |
| **Runtime** | [Node.js](https://nodejs.org/) | `v18+` | Server runtime executing in Native ES Module mode (`"type": "module"`) |
| **Framework** | [Express.js](https://expressjs.com/) | `^5.3.0` | HTTP routing, request parsing, and middleware pipeline |
| **Database** | [MongoDB](https://www.mongodb.com/) | `v6+` | NoSQL document storage for products, categories, admin users, and sessions |
| **ODM** | [Mongoose](https://mongoosejs.com/) | `^9.11.4` | Data modeling, validation schemas, population, and lifecycle hooks |
| **Authentication** | [express-session](https://github.com/expressjs/session) | `^1.18.1` | Cryptographically signed session cookie management |
| **Session Store** | [connect-mongo](https://github.com/jdesboeufs/connect-mongo) | `^5.1.0` | MongoDB-backed session persistence across restarts |
| **Password Hashing**| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | `^2.4.3` | Pure JavaScript bcrypt implementation for salted password hashing |
| **File Uploads** | [Multer](https://github.com/expressjs/multer) | `^2.5.0` | Multipart form handler with 2MB limits and MIME type filtering |
| **Slug Generation** | [Slugify](https://github.com/simov/slugify) | `^1.6.9` | Automated URL slug generation via Mongoose `pre("validate")` hooks |
| **View Engine** | [EJS](https://ejs.co/) | `^7.0.2` | Templating engine with reusable partial component architecture |
| **Styling** | Tailwind CSS & Custom Theme | — | Scandinavian minimalist palette with 3D ambient claymorphic design |
| **Icons & Fonts** | FontAwesome 6 & Google Fonts | — | Plus Jakarta Sans, Inter, and FontAwesome 6.7 vector icons |
| **Dev Tools** | [Nodemon](https://nodemon.io/) & [Dotenv](https://github.com/motdotla/dotenv) | — | Hot-reloading development server and environment configuration |

---

## 📁 Project Structure

```text
Cartivo/
├── admin/                                # Back-Office Subsystem
│   ├── controllers/
│   │   ├── adminCategoryController.js    # Category CRUD, duplicate slug handling, product dependency check
│   │   ├── adminController.js            # Dashboard metrics aggregation, login verification, logout
│   │   └── adminProductController.js     # Product CRUD, Multer image handling, disk cleanup
│   ├── middlewares/
│   │   └── adminAuth.js                  # requireAdminAuth & redirectIfAuthenticated gatekeepers
│   ├── models/
│   │   ├── AdminCategory.js              # Re-export wrapper for Category model
│   │   ├── AdminProduct.js               # Re-export wrapper for Product model
│   │   └── AdminUser.js                  # Re-export wrapper for AdminUser model
│   └── routes/
│       ├── adminCategoryRoutes.js        # Routes for /admin/categories
│       ├── adminProductRoutes.js         # Routes for /admin/products (with Multer upload)
│       └── adminRoutes.js                # Routes for /admin, /admin/dashboard, /admin/login, /admin/logout
│
├── config/
│   ├── db.js                             # MongoDB connection initialization via Mongoose
│   └── multer.js                         # Disk storage, 2MB limit, and image fileFilter
│
├── controllers/                          # Public Storefront Controllers
│   ├── categoryController.js             # Public category API endpoint
│   ├── contactController.js              # Lead submission handler and leads.json engine
│   └── productController.js              # Storefront home, shop queries, product details view
│
├── data/
│   └── leads.json                        # File-based JSON persistence for inquiry leads
│
├── models/                               # Core Mongoose Schemas
│   ├── AdminUser.js                      # Admin User schema with bcrypt pre-save & comparePassword
│   ├── Category.js                       # Category schema with automated slugify hook
│   └── Product.js                        # Product schema with category_id ref and slugify hook
│
├── public/                               # Static Web Assets
│   ├── css/
│   │   ├── admin/
│   │   │   └── style.css                 # Admin exclusive styling (sidebar, data-tables, status pills)
│   │   └── cartivo-theme.css             # Ambient 3D clay elements, animations, scrollbars
│   ├── js/
│   │   ├── admin/
│   │   │   └── admin.js                  # Admin client script (sidebar toggle, live search, icon picker)
│   │   └── shop.js                       # Storefront client script (cart localStorage, modal, slider)
│   └── uploads/                          # Target storage directory for uploaded product images
│
├── routes/
│   └── pageRoutes.js                     # Public web routes (/, /shop, /about, /contact, /product/:slug/view)
│
├── seeders/                              # Idempotent Database Seeders
│   ├── adminUserSeeder.js                # Bulk upsert for 3 default admin accounts (hashed passwords)
│   ├── categorySeeder.js                 # Bulk upsert for 8 standard product categories
│   └── productSeeder.js                  # Bulk upsert for 10 sample products with category references
│
├── views/                                # EJS View Templates
│   ├── admin/                            # Admin Portal Templates
│   │   ├── categories/
│   │   │   ├── create.ejs                # Add category form with interactive 35+ device icon picker
│   │   │   ├── edit.ejs                  # Edit category form with pre-filled attributes & icon picker
│   │   │   └── index.ejs                 # Tabular category list with instant search & action controls
│   │   ├── partials/                     # Dedicated Admin Global Components
│   │   │   ├── footer.ejs                # Admin minimalist footer
│   │   │   ├── footercdns.ejs            # Admin script inclusions (admin.js)
│   │   │   ├── headcdns.ejs              # Admin head CDN imports and admin/style.css
│   │   │   ├── header.ejs                # Admin topbar with breadcrumbs, profile badge, and logout
│   │   │   └── sidebar.ejs               # Collapsible navigation drawer with active route pills
│   │   ├── products/
│   │   │   ├── create.ejs                # Add product form with image upload preview
│   │   │   ├── edit.ejs                  # Edit product form with image replacement & preview
│   │   │   └── index.ejs                 # Tabular inventory list with stock alerts & metric cards
│   │   ├── dashboard.ejs                 # Executive Dashboard with metrics & quick actions
│   │   └── login.ejs                     # Branded admin sign-in page with feedback banners
│   │
│   ├── partials/                         # Storefront View Partials
│   │   ├── bottomBanner.ejs              # Reusable promotional CTA banner
│   │   ├── contact-section.ejs           # Reusable contact form + office location card
│   │   ├── footer.ejs                    # Storefront universal footer
│   │   ├── footercdns.ejs                # Storefront script inclusions
│   │   ├── headcdns.ejs                  # Storefront head CDN imports and theme CSS
│   │   ├── header.ejs                    # Floating capsule navigation bar with cart indicator
│   │   ├── product-card.ejs              # Storefront product card with quick-view triggers
│   │   └── quick-view-modal.ejs          # Pop-up modal for product preview & instant cart add
│   │
│   ├── 404.ejs                           # Branded 404 error page
│   ├── about.ejs                         # About Cartivo platform showcase
│   ├── contact.ejs                       # Dedicated contact inquiry page
│   ├── home.ejs                          # Storefront landing page with hero, slider, and products
│   ├── product-details.ejs               # Two-column single product specification showcase
│   └── shop.ejs                          # Storefront catalog with search filters and cart count
│
├── .env                                  # Active environment variables
├── .env.example                          # Environment configuration template
├── .gitignore                            # Git exclusion rules
├── AGENTS.md                             # Mandatory AI Agent Operating Guidelines & Rules
├── app.js                                # Express application setup, session store, and route mounting
├── package.json                          # Dependencies, scripts, and ESM configuration
├── README.md                             # Master project documentation
└── server.js                             # Application entrypoint: database bootstrap and HTTP listener
```

---

## 🧭 Routes & Navigation

### 1. Public Storefront Routes (`routes/pageRoutes.js`)

| Method | Endpoint | Handler | Access | Description | View |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `GET` | `/` | `getHomeProducts` | Public | Homepage with hero, category slider, and live items | `views/home.ejs` |
| `GET` | `/shop` | `getShopProducts` | Public | Catalog with `?search=` and `?category=` filters | `views/shop.ejs` |
| `GET` | `/product/:slug/view` | `getProductDetails` | Public | Detailed showcase for a single product by slug | `views/product-details.ejs` |
| `GET` | `/about` | Inline handler | Public | About Cartivo company & platform information | `views/about.ejs` |
| `GET` | `/contact` | `getContact` | Public | Contact inquiry page and office location | `views/contact.ejs` |
| `POST` | `/contact` | `submitContact` | Public | Saves lead to `data/leads.json` and redirects | Origin + `?success=true` |
| `ANY` | `*` | 404 Handler | Public | Fallback for non-existent routes | `views/404.ejs` |

---

### 2. Admin Authentication Routes (`admin/routes/adminRoutes.js`)

| Method | Endpoint | Handler | Access | Description | View / Action |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `GET` | `/admin/login` | `loginPage` | Guest | Admin sign-in interface (bypassed if logged in) | `views/admin/login.ejs` |
| `POST` | `/admin/login` | `verifyAdmin` | Guest | Authenticates admin credentials, creates session | Redirects to dashboard |
| `GET` | `/admin/logout` | `logoutAdmin` | Admin | Destroys session, clears cookie, redirects | Redirects to `/admin/login` |

---

### 3. Protected Back-Office Routes (`requireAdminAuth` Guarded)

| Method | Endpoint | Handler | Access | Description | View / Action |
| :--- | :--- | :--- | :---: | :--- | :--- |
| `GET` | `/admin` | `getAdminDashboard` | Admin | Executive dashboard with metrics and summaries | `views/admin/dashboard.ejs` |
| `GET` | `/admin/dashboard` | `getAdminDashboard` | Admin | Executive dashboard alias | `views/admin/dashboard.ejs` |
| `GET` | `/admin/products` | `getAdminProducts` | Admin | Product inventory table with stock warnings | `views/admin/products/index.ejs` |
| `GET` | `/admin/products/create` | `getAdminAddProduct` | Admin | Add new product form with image upload | `views/admin/products/create.ejs` |
| `POST` | `/admin/products` | `createAdminProduct` | Admin | Creates product with Multer image upload | Redirects to `/admin/products` |
| `GET` | `/admin/products/:id/edit`| `getAdminEditProduct` | Admin | Edit product form with image preview/replace | `views/admin/products/edit.ejs` |
| `POST` | `/admin/products/:id/update`| `updateAdminProduct` | Admin | Updates product fields & cleans up old image | Redirects to `/admin/products` |
| `POST` | `/admin/products/:id/delete`| `deleteAdminProduct` | Admin | Deletes product and unlinks image from disk | Redirects to `/admin/products` |
| `GET` | `/admin/categories` | `getAdminCategories` | Admin | Categories table with icons and status | `views/admin/categories/index.ejs` |
| `GET` | `/admin/categories/create`| `getAdminAddCategory` | Admin | Add category form with 35+ device icon picker | `views/admin/categories/create.ejs` |
| `POST` | `/admin/categories` | `createAdminCategory` | Admin | Creates category with auto-generated slug | Redirects to `/admin/categories` |
| `GET` | `/admin/categories/:id/edit`| `getAdminEditCategory` | Admin | Edit category form with icon picker | `views/admin/categories/edit.ejs` |
| `POST` | `/admin/categories/:id/update`| `updateAdminCategory` | Admin | Updates category fields and icon class | Redirects to `/admin/categories` |
| `POST` | `/admin/categories/:id/delete`| `deleteAdminCategory` | Admin | Deletes category (verifies 0 assigned products) | Redirects to `/admin/categories` |

---

## 🗄 Database Schemas & Data Models

### 1. Admin User Schema (`models/AdminUser.js`)
```javascript
{
  name:      { type: String, required: true, trim: true },
  email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:  { type: String, required: true }, // 60-character bcrypt hash
  role:      { type: String, enum: ["superadmin", "admin", "manager"], default: "admin" },
  status:    { type: String, enum: ["active", "inactive"], default: "active" },
  timestamps: true
}
```
*Features: Automated `pre("save")` bcrypt hashing with salt rounds of 10 and instance method `adminUser.comparePassword(candidatePassword)`.*

### 2. Category Schema (`models/Category.js`)
```javascript
{
  name:   { type: String, required: true, trim: true },
  slug:   { type: String, unique: true, lowercase: true, trim: true },
  icon:   { type: String, required: true }, // e.g. 'fa-solid fa-laptop'
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  timestamps: true
}
```
*Features: Automated `pre("validate")` hook to generate URL slugs using `slugify`.*

### 3. Product Schema (`models/Product.js`)
```javascript
{
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, unique: true, lowercase: true, trim: true },
  description: { type: String, required: false },
  image:       { type: String, required: false }, // e.g. '/uploads/1794000000-123456789.png'
  price:       { type: Number, required: true },
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  stock:       { type: Number, default: 0 },
  condition:   { type: String, required: false }, // e.g. 'New', 'Like New', 'Refurbished', 'Used'
  features:    { type: String, required: false },
  status:      { type: String, enum: ["active", "inactive"], default: "active" },
  timestamps:  true
}
```
*Features: Automated `pre("validate")` slugify hook and foreign key reference to `Category`.*

### 4. Contact Lead Model (`data/leads.json`)
```json
[
  {
    "id": "1793774019183",
    "name": "Sarah Jenkins",
    "email": "sarah@example.com",
    "phone": "+1 (555) 234-5678",
    "subject": "General Inquiry",
    "message": "Interested in enterprise wholesale inventory onboarding.",
    "createdAt": "2026-11-04T11:35:00.000Z"
  }
]
```

### 5. MongoDB Session Store (`connect-mongo`)
Sessions are stored in the `sessions` collection in MongoDB with a 24-hour TTL, ensuring administrators stay logged in across server restarts.

---

## 👥 Default Admin Accounts

The database seeder comes pre-configured with 3 default administrator accounts:

| Name | Email | Default Password | Role | Status |
| :--- | :--- | :--- | :---: | :---: |
| **Super Admin** | `admin@cartivo.com` | `admin123` | `superadmin` | `active` |
| **Sarah Jenkins** | `manager@cartivo.com` | `manager123` | `admin` | `active` |
| **Alex Morgan** | `alex@cartivo.com` | `alex123` | `manager` | `active` |

---

## 🚀 Quick Start & CLI Commands

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port `27017` (or a remote MongoDB Atlas URI)

### 2. Installation & Package Commands

#### Option A: One-Step Install (Existing Project)
If you already cloned the repository with `package.json`:

```bash
# Clone the repository
git clone https://github.com/harisnaveed/Cartivo.git
cd Cartivo

# Install all registered dependencies at once
npm install
```

---

#### Option B: Individual Package Installation Commands
If initializing from scratch or installing packages manually, run the following commands:

##### 1. All Packages in a Single Command:
```bash
npm install express mongoose dotenv ejs multer slugify bcryptjs express-session connect-mongo nodemon
```

##### 2. Modular Installation by Feature Category:

```bash
# 🌐 Core Web Server & Environment Variables
npm install express dotenv

# 🗄️ MongoDB Database & Object Data Modeling (ODM)
npm install mongoose

# 🎨 Server-Side HTML Templating Engine
npm install ejs

# 📁 Multipart File Uploads (Product Images)
npm install multer

# 🔗 URL Slug Generator (SEO-Friendly Slugs)
npm install slugify

# 🔐 Authentication, Password Hashing & MongoDB Session Store
npm install bcryptjs express-session connect-mongo

# ⚡ Live-Reload Development Server
npm install nodemon
```

#### Package Registry & Role Summary:

| Package | Command | Version | Primary Role in Cartivo |
| :--- | :--- | :---: | :--- |
| **`express`** | `npm install express` | `^5.3.0` | Core HTTP framework, middleware pipeline, routing |
| **`mongoose`** | `npm install mongoose` | `^9.11.4` | MongoDB schemas, validation, relationships, pre-save hooks |
| **`dotenv`** | `npm install dotenv` | `^18.0.9` | Loads secrets from `.env` (`PORT`, `MONGODB_URI`, `SESSION_SECRET`) |
| **`ejs`** | `npm install ejs` | `^7.0.2` | Renders server-side HTML views and partial components |
| **`multer`** | `npm install multer` | `^2.5.0` | Handles multipart form product image uploads with disk storage |
| **`slugify`** | `npm install slugify` | `^1.6.9` | Auto-generates lowercase URL slugs from names (`pre("validate")`) |
| **`bcryptjs`** | `npm install bcryptjs` | `^3.0.3` | Hashes passwords with 10 salt rounds and validates login |
| **`express-session`** | `npm install express-session` | `^1.19.0` | Creates secure, signed session cookies for admin access |
| **`connect-mongo`** | `npm install connect-mongo` | `^6.0.0` | Persists sessions in MongoDB (`sessions` collection, 24h TTL) |
| **`nodemon`** | `npm install nodemon` | `^3.1.14` | Auto-restarts Node server on file changes during development |

### 3. Environment Configuration
Copy `.env.example` to create your local `.env`:

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# macOS / Linux
cp .env.example .env
```

Verify your `.env` settings:
```env
# Server Configuration
PORT=3000
HOST=127.0.0.1

# MongoDB Connection String
MONGODB_URI=mongodb://127.0.0.1:27017/cartivo

# Session Secret Key
SESSION_SECRET=cartivo-super-secret-key-production-ready-2026
```

### 4. Database Seeders
Run the idempotent seeders to bootstrap your environment with default categories, sample catalog products, and hashed admin accounts:

```bash
# Step 1: Seed 8 active categories
npm run seed:categories

# Step 2: Seed 10 sample products linked to categories
npm run seed:products

# Step 3: Seed 3 hashed administrator accounts
npm run seed:admins
```

### 5. Run the Application

#### Development Mode (with hot-reload via Nodemon):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

### 6. Accessing the Platform

- **Customer Storefront**: [http://localhost:3000](http://localhost:3000)
- **Admin Login Portal**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- **Back-Office Dashboard**: [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

<div align="center">
  <sub>Built with ❤️ for elegant e-commerce and back-office inventory operations.</sub>
</div>
