import express from "express";

import {
    getAdminDashboard
} from "../controllers/adminController.js";

const router = express.Router();

// GET: /admin
router.get("/", getAdminDashboard);

// GET: /admin/dashboard
router.get("/dashboard", getAdminDashboard);

export default router;