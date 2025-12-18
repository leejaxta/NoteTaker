const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categories.controller");
const auth = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Note categories
 */

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get user categories
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Categories list
 */
router.get("/", auth, categoriesController.getCategories);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create category
 *     tags: [Categories]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 */
router.post("/", auth, categoriesController.createCategory);
router.put("/:id", auth, categoriesController.updateCategory);
router.delete("/:id", auth, categoriesController.deleteCategory);

module.exports = router;
