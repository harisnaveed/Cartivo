<div align="center">

# 🛒 Cartivo

**Manage smarter. Grow with clarity.**  
*A sleek, modern inventory management platform built with Node.js, Express, and MongoDB.*

[![Node.js Version](https://img.shields.io/badge/Node.js-v18%2B-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-v5.3-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_v9-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongoosejs.com/)
[![EJS](https://img.shields.io/badge/Templates-EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)](https://ejs.co/)
[![License](https://img.shields.io/badge/License-ISC-blue?style=for-the-badge)](LICENSE)

<br />

[Features](#-key-features) •
[Tech Stack](#-technology-stack) •
[Quick Start](#-quick-start) •
[Project Structure](#-project-structure) •
[Routes & Endpoints](#-routes--navigation) •
[Database Schema](#-data-model-schema) •
[Roadmap](#-future-roadmap)

---

</div>

## 📖 Overview

**Cartivo** is a full-featured inventory and product management application designed for modern businesses. It provides an intuitive, high-performance workspace to organize catalog collections, track live stock quantities, manage SKU entries, and gain clarity over business operations.

Featuring a dark glassmorphic design system with typography powered by **Inter**, Cartivo merges developer-friendly simplicity with an enterprise-ready aesthetic.

---

## ✨ Key Features

- **📊 Centralized Inventory Dashboard**  
  Overview metrics displaying total catalog items, active products, and low-stock alerts at a glance.

- **📦 Product Catalog & Exploration**  
  Browse products with pricing, category tags, stock health indicators, and direct query insights (`db.products.find()`).

- **➕ Product Intake Form**  
  Structured interface for adding items with full metadata support: SKU/product code, slug, categorization, pricing, stock count, and imagery.

- **🎨 Glassmorphic Dark UI**  
  Handcrafted Vanilla CSS design system with subtle glow effects, responsive card grids, status dots, and seamless micro-interactions.

- **⚡ Modern ES Module Architecture**  
  Built strictly with ES Modules (`"type": "module"`), modular route controllers, and clean separation of concerns.

- **🛡️ Custom 404 Error Recovery**  
  Branded 404 experience with helpful hints and one-click navigation back to active workspaces.

---

## 🛠 Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Runtime** | [Node.js](https://nodejs.org/) | JavaScript runtime environment (ESM) |
| **Framework** | [Express.js v5](https://expressjs.com/) | Fast, unopinionated minimalist web server |
| **Database** | [MongoDB](https://www.mongodb.com/) | NoSQL document database |
| **ODM** | [Mongoose v9](https://mongoosejs.com/) | Elegant MongoDB object modeling for Node.js |
| **View Engine** | [EJS](https://ejs.co/) | Embedded JavaScript templating with reusable partials |
| **Styling** | Vanilla CSS3 | Custom design system with CSS custom properties & glassmorphism |
| **Dev Tooling** | [Nodemon](https://nodemon.io/) & [Dotenv](https://www.npmjs.com/package/dotenv) | Hot-reloading and environment variable management |

---

## 📁 Project Structure

```text
cartivo/
├── config/
│   └── db.js                 # MongoDB connection logic via Mongoose
├── models/
│   └── Product.js            # Mongoose Product schema & model
├── public/
│   └── css/
│       └── style.css         # Global design system & component styles
├── routes/
│   └── pageRoutes.js         # Web page routes (Home, Products, New Product, 404)
├── views/
│   ├── partials/             # Reusable EJS components
│   │   ├── bottomBanner.ejs  # Call-to-action & playground banner
│   │   ├── footer.ejs        # Footer component
│   │   ├── footercdns.ejs    # Footer scripts & assets
│   │   ├── headcdns.ejs      # Meta tags, fonts & stylesheet links
│   │   └── header.ejs        # Main navigation bar
│   ├── 404.ejs               # Custom 404 error page
│   ├── add-product.ejs       # Add new product form page
│   ├── home.ejs              # Landing & overview page
│   └── products.ejs          # Inventory catalog page
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore rules (node_modules, .env, etc.)
├── app.js                    # Express app initialization & middleware configuration
├── package.json              # Project metadata & npm dependencies
├── README.md                 # Project documentation
└── server.js                 # Entry point: DB connection & server listener
```

---

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [npm](https://www.npmjs.com/) (v9.0.0 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) installed and running locally, or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection URI

### 2. Clone the Repository

```bash
git clone https://github.com/harisnaveed/Cartivo.git
cd cartivo
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory by copying the `.env.example` template:

```bash
# On Windows (PowerShell):
Copy-Item .env.example .env

# On Linux/macOS:
cp .env.example .env
```

Review and adjust the configuration values in `.env`:

```env
PORT=3000
HOST=127.0.0.1
MONGODB_URI=mongodb://127.0.0.1:27017/cartivo
```

### 5. Launch the Application

#### Development Mode (with auto-reload):
```bash
npm run dev
```

#### Production Mode:
```bash
npm start
```

Once started, navigate to:
```text
http://localhost:3000
```

---

## 🧭 Routes & Navigation

| Method | Endpoint | Description | View |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Welcome landing & inventory dashboard preview | `views/home.ejs` |
| `GET` | `/products` | Catalog view with statistics & inventory collection | `views/products.ejs` |
| `GET` | `/product/new` | Product creation interface | `views/add-product.ejs` |
| `GET` | `/about` | About Cartivo & business overview | `views/about.ejs` |
| `ANY` | `*` | Custom 404 error page | `views/404.ejs` |

---

## 🗄 Data Model Schema

The application uses Mongoose to interact with the MongoDB `products` collection.

```javascript
// models/Product.js
{
  name:        { type: String, required: true },
  description: { type: String, required: false },
  image:       { type: String, required: false },
  price:       { type: Number, required: true },
  category:    { type: String, required: true },
  stock:       { type: Number, default: 0 },
  status:      { type: String, enum: ["active", "inactive"], default: "active" },
  timestamps:  true // Automatically manages createdAt & updatedAt
}
```

---

## 🔮 Future Roadmap

- [ ] Complete full CRUD API controllers (Create, Read, Update, Delete) linked with MongoDB collections.
- [ ] Image upload handling
- [ ] Live search, filter by category/status, and pagination for large inventory sets.
- [ ] Low-stock notification triggers & alerts.
- [ ] Export inventory data to CSV / PDF formats.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ for simple and powerful inventory operations.</sub>
</div>
