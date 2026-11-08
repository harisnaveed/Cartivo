import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import MongoStore from "connect-mongo";

import adminCategoryRoutes from "./admin/routes/adminCategoryRoutes.js";
import adminProductRoutes from "./admin/routes/adminProductRoutes.js";
import adminRoutes from "./admin/routes/adminRoutes.js";
import { requireAdminAuth } from "./admin/middlewares/adminAuth.js";
import pageRoutes from "./routes/pageRoutes.js";

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Template engine
app.set("view engine", "ejs");

// Views directory
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session Management with MongoDB Store
app.use(
  session({
    secret: process.env.SESSION_SECRET || "cartivo-super-secret-key-production-ready-2026",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/cartivo",
      collectionName: "sessions",
      ttl: 24 * 60 * 60, // 1 day
      autoRemove: "native",
    }),
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Global view variables (Path & Authenticated Admin user)
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  res.locals.currentAdmin = (req.session && req.session.adminUser) ? req.session.adminUser : null;
  next();
});

// Mounted Routers
app.use("/admin", adminRoutes);
app.use("/admin/categories", requireAdminAuth, adminCategoryRoutes);
app.use("/admin/products", requireAdminAuth, adminProductRoutes);
app.use("/", pageRoutes);

// Export application
export default app;
