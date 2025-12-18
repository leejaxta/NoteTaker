const express = require("express");
const router = express.Router();
const categoriesController = require("../controllers/categories.controller");
const auth = require("../middleware/auth.middleware");

router.get("/", auth, categoriesController.getCategories);
router.post("/", auth, categoriesController.createCategory);
router.put("/:id", auth, categoriesController.updateCategory);
router.delete("/:id", auth, categoriesController.deleteCategory);

module.exports = router;
