import express from "express";

const router = express.Router();

// Home page
router.get("/", (req, res) => {
  res.render("home");
});

// About page
router.get("/about", (req, res) => {
  res.render("about");
});

// Products page
router.get("/products", (req, res) => {
  res.render("products");
});

// Add Product Page
router.get("/product/new", (req, res) => {
  res.render("add-product");
});

// 404 - Always last
router.use((req, res) => {
  res.status(404).render("404");
});

export default router;
