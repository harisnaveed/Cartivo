import express from "express";
import {
  getProducts,
  createProduct,
  getProductDetails,
  deleteProduct,
  getShopProducts,
  getHomeProducts,
} from "../controllers/productController.js";
import upload from "../config/multer.js";

const router = express.Router();

// Home page
router.get("/", getHomeProducts);

// About page
router.get("/about", (req, res) => {
  res.render("about");
});

// Contact page (GET)
router.get("/contact", (req, res) => {
  res.render("contact", {
    success: req.query.success === "true",
  });
});

// Contact form submission (POST)
router.post("/contact", (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log("Contact submission received:", { name, email, subject, message });
  res.redirect("/contact?success=true");
});

// Products page
router.get("/products", getProducts);

// Create product
router.post("/create-product", upload.single("product_image"), createProduct);

// Add Product Page
router.get("/product/new", (req, res) => {
  res.render("add-product");
});

// Single product details - keep after specific product routes
router.get("/product/:id/view", getProductDetails);

// delete product
router.post("/product/:id/delete", deleteProduct);

// all active products for shop page
router.get("/shop", getShopProducts);

// 404 - Always last
router.use((req, res) => {
  res.status(404).render("404");
});

export default router;
