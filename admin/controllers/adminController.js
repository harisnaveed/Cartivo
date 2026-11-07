import Category from "../models/AdminCategory.js";
import Product from "../models/AdminProduct.js";

// GET: Display dashboard
export const getAdminDashboard = async (req, res) => {
    try {
        // Query products, categories, and metrics in parallel
        const [products, categories, activeProducts, lowStockProducts] = await Promise.all([
            Product.find().populate("category_id").sort({ createdAt: -1 }),
            Category.find().sort({ createdAt: -1 }),
            Product.countDocuments({ status: "active" }),
            Product.countDocuments({ stock: { $lt: 5 } })
        ]);

        res.render("admin/dashboard", {
            products,
            categories,
            activeProducts,
            lowStockProducts,
            currentPage: "dashboard",
            title: "Admin Dashboard"
        });

    } catch (error) {
        console.error("Admin Dashboard Error:", error.message);
        res.status(500).send("Unable to load dashboard.");
    }
};
