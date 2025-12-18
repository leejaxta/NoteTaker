const pool = require("../config/db");

exports.getCategories = async (userId) => {
  const [rows] = await pool.query(
    "SELECT id, name FROM categories WHERE user_id = ? ORDER BY name",
    [userId]
  );
  return rows;
};

exports.createCategory = async (userId, { name }) => {
  if (!name) {
    throw { status: 400, message: "Category name is required" };
  }

  try {
    const [result] = await pool.query(
      "INSERT INTO categories (user_id, name) VALUES (?, ?)",
      [userId, name]
    );

    return { id: result.insertId, name };
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      throw { status: 409, message: "Category already exists" };
    }
    throw err;
  }
};

exports.updateCategory = async (userId, categoryId, { name }) => {
  if (!name) {
    throw { status: 400, message: "Category name is required" };
  }

  const [result] = await pool.query(
    "UPDATE categories SET name = ? WHERE id = ? AND user_id = ?",
    [name, categoryId, userId]
  );

  if (result.affectedRows === 0) {
    throw { status: 404, message: "Category not found or unauthorized" };
  }

  return { id: categoryId, name };
};

exports.deleteCategory = async (userId, categoryId) => {
  const [result] = await pool.query(
    "DELETE FROM categories WHERE id = ? AND user_id = ?",
    [categoryId, userId]
  );

  if (result.affectedRows === 0) {
    throw { status: 404, message: "Category not found or unauthorized" };
  }
};
