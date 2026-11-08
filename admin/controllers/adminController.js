import Category from "../models/AdminCategory.js";
import Product from "../models/AdminProduct.js";
import AdminUser from "../models/AdminUser.js";

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


// GET: Display login
export const loginPage = async (req, res) => {
    try {
        res.render("admin/login", {
            currentPage: "login",
            title: "Admin Login"
        });

    } catch (error) {
        console.error("Admin Login Error:", error.message);
        res.status(500).send("Unable to load login page.");
    }
};

// POST: Verify admin credentials
export const verifyAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validate required fields
        if (!email || !password) {
            return res.status(400).render("admin/login", {
                currentPage: "login",
                title: "Admin Login",
                error: "Please fill in all fields.",
                email: email || ""
            });
        }

        // 2. Query admin user by email (case-insensitive & trimmed)
        const admin = await AdminUser.findOne({
            email: email.trim().toLowerCase(),
            status: "active"
        });

        if (!admin) {
            return res.status(401).render("admin/login", {
                currentPage: "login",
                title: "Admin Login",
                error: "Email did not match with any user.",
                email: email
            });
        }

        // 3. Verify hashed password via bcrypt comparison
        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {
            return res.status(401).render("admin/login", {
                currentPage: "login",
                title: "Admin Login",
                error: "Password did not match.",
                email: email
            });
        }

        // 4. Create authenticated session
        req.session.adminUser = {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        };

        console.log(`Admin Authenticated Successfully: ${admin.name} (${admin.email})`);

        // 5. Redirect to originally requested page or dashboard
        const redirectUrl = req.session.returnTo || "/admin/dashboard";
        delete req.session.returnTo;

        res.redirect(redirectUrl);

    } catch (error) {
        console.error("Admin Verify Error:", error.message);
        res.status(500).render("admin/login", {
            currentPage: "login",
            title: "Admin Login",
            error: "Unable to verify admin. Please try again.",
            email: req.body?.email || ""
        });
    }
};

// GET: Log out admin
export const logoutAdmin = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Logout Error:", err.message);
        }
        res.clearCookie("connect.sid");
        res.redirect("/admin/login");
    });
};
