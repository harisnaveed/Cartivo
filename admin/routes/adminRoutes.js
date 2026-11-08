import express from "express";

import {
    getAdminDashboard,
    loginPage,
    verifyAdmin,
    logoutAdmin
} from "../controllers/adminController.js";

import {
    requireAdminAuth,
    redirectIfAuthenticated
} from "../middlewares/adminAuth.js";

const router = express.Router();

// Public Auth Routes (Redirect to dashboard if already authenticated)
router.get("/login", redirectIfAuthenticated, loginPage);
router.post("/login", redirectIfAuthenticated, verifyAdmin);

// Protected Admin Routes
router.get("/", requireAdminAuth, getAdminDashboard);
router.get("/dashboard", requireAdminAuth, getAdminDashboard);
router.get("/logout", requireAdminAuth, logoutAdmin);

export default router;
