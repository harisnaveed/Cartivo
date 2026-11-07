import express from "express";

import {
    getAdminCategories,
    getAdminAddCategory,
    createAdminCategory,
    getAdminEditCategory,
    updateAdminCategory,
    deleteAdminCategory
} from "../controllers/adminCategoryController.js";

const router = express.Router();

// Category management
router.get("/", getAdminCategories);

router.get("/create", getAdminAddCategory);

router.post("/", createAdminCategory);

router.get("/:id/edit", getAdminEditCategory);

router.post("/:id/update", updateAdminCategory);

router.post("/:id/delete", deleteAdminCategory);

export default router;