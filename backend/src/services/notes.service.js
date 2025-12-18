const pool = require("../config/db");

exports.createNote = async (userId, { title, content, categoryIds = [] }) => {
  if (!title || !content) {
    throw { status: 400, message: "Title and content are required" };
  }

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [result] = await conn.query(
      "INSERT INTO notes (user_id, title, content) VALUES (?, ?, ?)",
      [userId, title, content]
    );

    const noteId = result.insertId;

    // Insert categories if provided
    for (const categoryId of categoryIds) {
      await conn.query(
        "INSERT INTO note_categories (note_id, category_id) VALUES (?, ?)",
        [noteId, categoryId]
      );
    }

    await conn.commit();
    return { id: noteId, title, content };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.getNotes = async (userId, query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;
  const { categoryId, search, sort = "updated_at", order = "DESC" } = query;

  let sql = `
    SELECT DISTINCT n.*
    FROM notes n
    LEFT JOIN note_categories nc ON n.id = nc.note_id
    WHERE n.user_id = ?
  `;
  const params = [userId];

  if (categoryId) {
    sql += " AND nc.category_id = ?";
    params.push(categoryId);
  }

  if (search) {
    sql += " AND (n.title LIKE ? OR n.content LIKE ?)";
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += ` ORDER BY n.${sort} ${order} LIMIT ? OFFSET ?`;
  params.push(limit, offset);

  const [rows] = await pool.query(sql, params);

  return {
    page,
    limit,
    data: rows,
  };
};

exports.getNoteById = async (userId, noteId) => {
  const [rows] = await pool.query(
    "SELECT * FROM notes WHERE id = ? AND user_id = ?",
    [noteId, userId]
  );

  if (rows.length === 0) {
    throw { status: 404, message: "Note not found" };
  }

  return rows[0];
};

exports.updateNote = async (userId, noteId, { title, content }) => {
  if (!title || !content) {
    throw { status: 400, message: "Title and content are required" };
  }

  const [result] = await pool.query(
    "UPDATE notes SET title = ?, content = ? WHERE id = ? AND user_id = ?",
    [title, content, noteId, userId]
  );

  if (result.affectedRows === 0) {
    throw { status: 404, message: "Note not found or unauthorized" };
  }

  return { id: noteId, title, content };
};

exports.updateNoteCategories = async (userId, noteId, categoryIds) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    const [notes] = await conn.query(
      "SELECT id FROM notes WHERE id = ? AND user_id = ?",
      [noteId, userId]
    );

    if (notes.length === 0) {
      throw { status: 404, message: "Note not found" };
    }

    await conn.query("DELETE FROM note_categories WHERE note_id = ?", [noteId]);

    for (const categoryId of categoryIds) {
      await conn.query(
        "INSERT INTO note_categories (note_id, category_id) VALUES (?, ?)",
        [noteId, categoryId]
      );
    }

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.deleteNote = async (userId, noteId) => {
  const [result] = await pool.query(
    "DELETE FROM notes WHERE id = ? AND user_id = ?",
    [noteId, userId]
  );

  if (result.affectedRows === 0) {
    throw { status: 404, message: "Note not found or unauthorized" };
  }
};
