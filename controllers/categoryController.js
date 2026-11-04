import Category from "../models/Category.js";

// Render Add Product page
export const getAddProductPage = async (req, res) => {
  try {
    const categories = await Category.find({
      status: "active",
    });

    res.render("add-product", { categories });
  } catch (error) {
    res.status(500).send("Unable to load categories.");
  }
};

// GET: Display all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({
      status: "active",
    });

    res.render("add-product", { categories });
  } catch (error) {
    res.status(500).send("Unable to load categories.");
  }
};

// Return categories as JSON
export const getCategoriesAPI = async (req, res) => {
  try {
    const categories = await Category.find({
      status: "active",
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: "Unable to load categories.",
    });
  }
};

// POST: Insert a new category
export const createCategory = async (req, res) => {
  try {
    const { name, icon, status } = req.body;

    const newCategory = await Category.create({
      name,
      icon,
      status,
    });

    console.log("Category Created:", newCategory);

    res.redirect("/admin/categories/categories");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Error creating category: ", error.message);
  }
};
