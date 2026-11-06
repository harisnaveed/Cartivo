
import Category from "../models/AdminCategory.js";
import Product from "../models/AdminProduct.js";

// GET: Display all categories
export const getAdminCategories = async (req, res) => {
    try {
        const categories = await Category.find()
            .sort({ createdAt: -1 });

        res.render("admin/categories/index", {
            categories,
            currentPage: "categories",
            title: "Manage Categories"
        });

    } catch (error) {
        console.error("Admin Categories Error:", error.message);
        res.status(500).send("Unable to load categories.");
    }
};


// GET: Render Add Category page
export const getAdminAddCategory = (req, res) => {
    res.render("admin/categories/create", {
        currentPage: "categories",
        title: "Add Category"
    });
};


// POST: Create a new category
export const createAdminCategory = async (req, res) => {
    try {
        const { name, icon, status } = req.body;

        const newCategory = await Category.create({
            name,
            icon,
            status
        });

        console.log("Admin Category Created:", newCategory.name);

        res.redirect("/admin/categories");

    } catch (error) {
        console.error("Create Category Error:", error.message);

        if (error.code === 11000) {
            return res.status(409).send("Category slug already exists.");
        }

        res.status(500).send("Unable to create category.");
    }
};


// GET: Render Edit Category page
export const getAdminEditCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Category.db.base.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid Category ID.");
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).send("Category not found.");
        }

        res.render("admin/categories/edit", {
            category,
            currentPage: "categories",
            title: "Edit Category"
        });

    } catch (error) {
        console.error("Edit Category Error:", error.message);
        res.status(500).send("Unable to load category.");
    }
};


// POST: Update category
export const updateAdminCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, icon, status } = req.body;

        if (!Category.db.base.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid Category ID.");
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).send("Category not found.");
        }

        // Update category fields
        category.name = name;
        category.icon = icon;
        category.status = status;

        // Save triggers your pre("validate") slug middleware
        await category.save();

        console.log("Admin Category Updated:", category.name);

        res.redirect("/admin/categories");

    } catch (error) {
        console.error("Update Category Error:", error.message);

        if (error.code === 11000) {
            return res.status(409).send("Category slug already exists.");
        }

        res.status(500).send("Unable to update category.");
    }
};


// POST: Delete category
export const deleteAdminCategory = async (req, res) => {
    try {
        const { id } = req.params;

        if (!Category.db.base.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid Category ID.");
        }

        const category = await Category.findById(id);

        if (!category) {
            return res.status(404).send("Category not found.");
        }

        // Check whether products are assigned to this category
        const productCount = await Product.countDocuments({
            category_id: category._id
        });

        if (productCount > 0) {
            return res.status(400).send(
                `Cannot delete this category. ${productCount} product(s) are assigned to it.`
            );
        }

        await Category.findByIdAndDelete(id);

        console.log("Admin Category Deleted:", category.name);

        res.redirect("/admin/categories");

    } catch (error) {
        console.error("Delete Category Error:", error.message);
        res.status(500).send("Unable to delete category.");
    }
};
