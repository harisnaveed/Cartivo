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
router.get("/categories", getAdminCategories);

router.get("/categories/create", getAdminAddCategory);

router.post("/categories", createAdminCategory);

router.get("/categories/:id/edit", getAdminEditCategory);

router.post("/categories/:id/update", updateAdminCategory);

router.post("/categories/:id/delete", deleteAdminCategory);

export default router;