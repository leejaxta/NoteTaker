const categoriesService = require("../services/categories.service");
const { success } = require("../utils/apiResponse");

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await categoriesService.getCategories(req.user.id);
    success(res, categories);
  } catch (err) {
    next(err);
  }
};

exports.createCategory = async (req, res, next) => {
  try {
    const category = await categoriesService.createCategory(
      req.user.id,
      req.body
    );
    success(res, category, "Category created");
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const category = await categoriesService.updateCategory(
      req.user.id,
      req.params.id,
      req.body
    );
    success(res, category, "Category updated");
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    await categoriesService.deleteCategory(req.user.id, req.params.id);
    success(res, null, "Category deleted");
  } catch (err) {
    next(err);
  }
};
