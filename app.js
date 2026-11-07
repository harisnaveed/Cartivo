import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import adminCategoryRoutes from "./admin/routes/adminCategoryRoutes.js";
import adminProductRoutes from "./admin/routes/adminProductRoutes.js";
import adminRoutes from "./admin/routes/adminRoutes.js";


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

// Get current URL for navigation
// res.locals makes the variable available to all EJS templates rendered during that request.
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Routes
import pageRoutes from "./routes/pageRoutes.js";


app.use("/admin", adminRoutes);
app.use("/admin/categories", adminCategoryRoutes);
app.use("/admin/products", adminProductRoutes);
app.use("/", pageRoutes);
// Export application
export default app;
