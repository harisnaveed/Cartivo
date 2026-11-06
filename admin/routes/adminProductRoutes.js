import express from "express";

import {
    getAdminProducts,
    getAdminAddProduct,
    createAdminProduct,
    getAdminEditProduct,
    updateAdminProduct,
    deleteAdminProduct
} from "../controllers/adminProductController.js";

import upload from "../../config/multer.js";

const router = express.Router();

// Product listing
router.get("/", getAdminProducts);

// Add product page
router.get("/create", getAdminAddProduct);

// Create product
router.post(
    "/",
    upload.single("product_image"),
    createAdminProduct
);

// Edit product page
router.get("/:id/edit", getAdminEditProduct);

// Update product
router.post(
    "/:id/update",
    upload.single("product_image"),
    updateAdminProduct
);

// Delete product
router.post("/:id/delete", deleteAdminProduct);

export default router;