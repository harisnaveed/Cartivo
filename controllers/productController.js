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

// GET: View single product details
export const getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!Product.db.base.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Product ID");
    }

    // Find product by ID
    const product = await Product.findById(id);

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

// DELETE: Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!Product.db.base.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid Product ID");
    }

    // Find and delete product
    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).send("Product not found");
    }

    console.log("Product Deleted:", deletedProduct.name);

    res.redirect("/products");
  } catch (error) {
    console.error("Delete Product Error:", error.message);
    res.status(500).send("Error deleting product");
  }
};
