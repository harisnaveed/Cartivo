import express from "express";

import upload from "../../config/multer.js";

const router = express.Router();

// Create product
router.post("/create-product", upload.single("product_image"), createProduct);

// Add Product Page
router.get("/product/new", getAddProductPage);

// Single product details - keep after specific product routes
router.get("/product/:slug/view", getProductDetails);

// delete product
router.post("/product/:id/delete", deleteProduct);

// Products page
router.get("/admin/products", getProducts);

// 404 - Always last
router.use((req, res) => {
  res.status(404).render("404");
});

export default router;
