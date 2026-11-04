import express from "express";
import {
  getProducts,
  createProduct,
  getProductDetails,
  deleteProduct,
  getShopProducts,
  getHomeProducts,
} from "../controllers/productController.js";
import { getContact, submitContact } from "../controllers/contactController.js";
import { getAddProductPage } from "../controllers/categoryController.js";

import upload from "../config/multer.js";

const router = express.Router();

// Home page
router.get("/", getHomeProducts);

// About page
router.get("/about", (req, res) => {
  res.render("about");
});

// Contact page (GET)
router.get("/contact", getContact);

// Contact form submission (POST)
router.post("/contact", submitContact);

// Products page
router.get("/products", getProducts);

// Create product
router.post("/create-product", upload.single("product_image"), createProduct);

// Add Product Page
router.get("/product/new", getAddProductPage);

// Single product details - keep after specific product routes
router.get("/product/:slug/view", getProductDetails);

// delete product
router.post("/product/:id/delete", deleteProduct);

// all active products for shop page
router.get("/shop", getShopProducts);

// 404 - Always last
router.use((req, res) => {
  res.status(404).render("404");
});

export default router;
