import Product from "../models/Product.js";

// GET: Display all products
export const getProducts = async (req, res) => {
  try {
    // all products
    const products = await Product.find();

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
      category,
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
      category,
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
