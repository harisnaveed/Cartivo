
import Product from "../models/AdminProduct.js";
import Category from "../models/AdminCategory.js";

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Uploads directory
const uploadsDir = path.resolve(__dirname, "../../public/uploads");


// GET: Display all products
export const getAdminProducts = async (req, res) => {
    try {
        // Fetch all products with category information
        const products = await Product.find()
            .populate("category_id")
            .sort({ createdAt: -1 });

        // Count active products
        const activeProducts = await Product.countDocuments({
            status: "active"
        });

        // Count products with stock below 5
        const lowStockProducts = await Product.countDocuments({
            stock: { $lt: 5 }
        });

        res.render("admin/products/index", {
            products,
            activeProducts,
            lowStockProducts,
            currentPage: "products",
            title: "Manage Products"
        });

    } catch (error) {
        console.error("Admin Products Error:", error.message);
        res.status(500).send("Unable to load products.");
    }
};


// GET: Display Add Product page
export const getAdminAddProduct = async (req, res) => {
    try {
        // Fetch active categories for dropdown
        const categories = await Category.find({
            status: "active"
        }).sort({ name: 1 });

        res.render("admin/products/create", {
            categories,
            currentPage: "products",
            title: "Add Product"
        });

    } catch (error) {
        console.error("Add Product Page Error:", error.message);
        res.status(500).send("Unable to load Add Product page.");
    }
};


// POST: Create a new product
export const createAdminProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category_id,
            stock,
            condition,
            features,
            status
        } = req.body;

        // Get uploaded image path
        const image = req.file
            ? `/uploads/${req.file.filename}`
            : "";

        // Create product
        const newProduct = await Product.create({
            name,
            description,
            image,
            price,
            category_id,
            stock,
            condition,
            features,
            status
        });

        console.log("Admin Product Created:", newProduct.name);

        res.redirect("/admin/products");

    } catch (error) {
        console.error("Admin Create Product Error:", error.message);

        res.status(500).send("Unable to create product.");
    }
};


// GET: Display Edit Product page
export const getAdminEditProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!Product.db.base.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid Product ID.");
        }

        // Find product
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send("Product not found.");
        }

        // Fetch categories for dropdown
        const categories = await Category.find().sort({ name: 1 });

        res.render("admin/products/edit", {
            product,
            categories,
            currentPage: "products",
            title: "Edit Product"
        });

    } catch (error) {
        console.error("Edit Product Error:", error.message);
        res.status(500).send("Unable to load product.");
    }
};


// POST: Update product
export const updateAdminProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!Product.db.base.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid Product ID.");
        }

        // Find existing product
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send("Product not found.");
        }

        const {
            name,
            description,
            price,
            category_id,
            stock,
            condition,
            features,
            status
        } = req.body;

        // Update product fields
        product.name = name;
        product.description = description;
        product.price = price;
        product.category_id = category_id;
        product.stock = stock;
        product.condition = condition;
        product.features = features;
        product.status = status;

        // Store old image path
        const oldImage = product.image;

        // Replace image if a new image was uploaded
        if (req.file) {
            product.image = `/uploads/${req.file.filename}`;
        }

        // Save product
        // This also triggers your pre("validate") slug middleware
        await product.save();

        // Delete old image after successful update
        if (req.file && oldImage) {
            const oldFilename = path.basename(oldImage);
            const oldImagePath = path.join(uploadsDir, oldFilename);

            try {
                await fs.unlink(oldImagePath);
                console.log("Old product image deleted:", oldFilename);

            } catch (error) {
                if (error.code !== "ENOENT") {
                    console.error("Old Image Cleanup Error:", error.message);
                }
            }
        }

        console.log("Admin Product Updated:", product.name);

        res.redirect("/admin/products");

    } catch (error) {
        console.error("Admin Update Product Error:", error.message);
        res.status(500).send("Unable to update product.");
    }
};


// POST: Delete product and its image
export const deleteAdminProduct = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate MongoDB ID
        if (!Product.db.base.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid Product ID.");
        }

        // Find product
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send("Product not found.");
        }

        // Delete product from MongoDB first
        await Product.findByIdAndDelete(id);

        // Delete associated image
        if (product.image) {
            const imageFilename = path.basename(product.image);
            const imagePath = path.join(uploadsDir, imageFilename);

            try {
                await fs.unlink(imagePath);

                console.log("Product Image Deleted:", imageFilename);

            } catch (error) {
                if (error.code !== "ENOENT") {
                    console.error("Image Cleanup Error:", error.message);
                }
            }
        }

        console.log("Admin Product Deleted:", product.name);

        res.redirect("/admin/products");

    } catch (error) {
        console.error("Admin Delete Product Error:", error.message);
        res.status(500).send("Unable to delete product.");
    }
};
