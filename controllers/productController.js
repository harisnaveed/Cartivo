import Product from "../models/Product.js";
import Category from "../models/Category.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsDir = path.join(__dirname, "../public/uploads");

// GET: Display all products
export const getProducts = async (req, res) => {
  try {
    // all products
    const products = await Product.find().populate("category_id");

    // Count active products
    const activeProducts = await Product.countDocuments({
      status: "active",
    });

    // Count products with stock below 5
    const lowStockProducts = await Product.countDocuments({
      stock: { $lt: 5 },
    });

    res.render("products", {
      products: products,
      activeProducts,
      lowStockProducts,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error fetching products");
  }
};

// POST: Insert a new product
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category_id,
      stock,
      condition,
      features,
      status,
    } = req.body;

    // Get uploaded image path
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const newProduct = await Product.create({
      name,
      description,
      image,
      price,
      category_id,
      stock,
      condition,
      features,
      status,
    });

    console.log("Product Created:", newProduct);

    res.redirect("/products");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error creating product: ", error.message);
  }
};

// GET: View single product details
export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!Product.db.base.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Product ID");
    }

    // Find product by ID
    const product = await Product.findById(id).populate("category_id");

    if (!product) {
      return res.status(404).render("404");
    }

    // Render product details page
    res.render("product-details", {
      product,
    });
  } catch (error) {
    console.error("Product Details Error:", error.message);
    res.status(500).send("Error fetching product details");
  }
};

// DELETE: Delete product and its image
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!Product.db.base.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Product ID");
    }

    // Find product first
    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).send("Product not found");
    }

    // Delete image from uploads folder
    if (product.image) {
      const imageFilename = path.basename(product.image);
      const imagePath = path.join(uploadsDir, imageFilename);

      try {
        await fs.unlink(imagePath);
        console.log("Product image deleted:", imageFilename);
      } catch (error) {
        if (error.code !== "ENOENT") {
          throw error;
        }

        console.log("Image file not found:", imageFilename);
      }
    }

    // Delete product from MongoDB
    await Product.findByIdAndDelete(id);

    console.log("Product Deleted:", product.name);

    res.redirect("/products");
  } catch (error) {
    console.error("Delete Product Error:", error.message);
    res.status(500).send("Error deleting product");
  }
};

// Show all active products in Shop
export const getShopProducts = async (req, res) => {
  try {
    const products = await Product.find({
      status: "active",
    }).sort({ createdAt: -1 });

    res.render("shop", {
      products,
      currentPage: "shop",
    });
  } catch (error) {
    console.error("Shop Error:", error.message);
    res.status(500).send("Unable to load shop products.");
  }
};

// GET: Home page with active categories and products
export const getHomeProducts = async (req, res) => {
  try {
    // Fetch active products
    const products = await Product.find({
      status: "active",
    })
      .populate("category_id")
      .sort({ createdAt: -1 });

    // Fetch active categories
    const categories = await Category.find({
      status: "active",
    }).sort({ createdAt: -1 });

    res.render("home", {
      products,
      categories,
      currentPage: "home",
      success: req.query.success === "true",
    });
  } catch (error) {
    console.error("Home Route Error:", error.message);

    res.status(500).render("home", {
      products: [],
      categories: [],
      currentPage: "home",
      success: false,
    });
  }
};
