import express from "express";
import {
  getProducts,
  createProduct,
} from "../controllers/productController.js";
import upload from "../config/multer.js";

const router = express.Router();

// Home page
router.get("/", (req, res) => {
  res.render("home");
});

// About page
router.get("/about", (req, res) => {
  res.render("about");
});

// // Products page
// router.get("/products", (req, res) => {
//   res.render("products");
// });

// Products page
router.get("/products", getProducts);

// Create product
// router.post("/create-product", createProduct); // for simple form textual not files in form

router.post("/create-product", upload.single("product_image"), createProduct);

// Add Product Page
router.get("/product/new", (req, res) => {
  res.render("add-product");
});

// 404 - Always last
router.use((req, res) => {
  res.status(404).render("404");
});

export default router;
