const pool = require("../config/db");
const logger = require("../utils/logger");

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

    for (const categoryId of categoryIds) {
      await conn.query(
        "INSERT INTO note_categories (note_id, category_id) VALUES (?, ?)",
        [noteId, categoryId]
      );
    }

    await conn.commit();
    logger.info("Note created | user=%d note=%d", userId, noteId);
    return { id: noteId, title, content };
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
};

exports.getNotes = async (userId, query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || 10, 50);
  const offset = (page - 1) * limit;

  const { categoryId, search } = query;

  const allowedSortFields = ["created_at", "updated_at", "title"];
  const sort = allowedSortFields.includes(query.sort)
    ? query.sort
    : "updated_at";

  const order = query.order === "ASC" ? "ASC" : "DESC";

  const whereClauses = [`n.user_id = ?`];
  const params = [userId];

  if (categoryId) {
    whereClauses.push(`nc.category_id = ?`);
    params.push(categoryId);
  }

  if (search) {
    whereClauses.push(`(n.title LIKE ? OR n.content LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }

  const whereSQL = whereClauses.join(" AND ");


  const countSql = `
    SELECT COUNT(DISTINCT n.id) AS total
    FROM notes n
    LEFT JOIN note_categories nc ON n.id = nc.note_id
    WHERE ${whereSQL}
  `;

  const [[{ total }]] = await pool.query(countSql, params);


  const dataSql = `
    SELECT
      n.id,
      n.title,
      n.content,
      n.created_at,
      n.updated_at,
      GROUP_CONCAT(
        DISTINCT JSON_OBJECT(
          'id', c.id,
          'name', c.name
        )
      ) AS categories
    FROM notes n
    LEFT JOIN note_categories nc ON n.id = nc.note_id
    LEFT JOIN categories c ON c.id = nc.category_id
    WHERE ${whereSQL}
    GROUP BY n.id
    ORDER BY n.${sort} ${order}
    LIMIT ? OFFSET ?
  `;

  const dataParams = [...params, limit, offset];
  const [rows] = await pool.query(dataSql, dataParams);


  const data = rows.map(note => ({
    ...note,
    categories: note.categories
      ? JSON.parse(`[${note.categories}]`)
      : []
  }));

  const totalPages = Math.ceil(total / limit);

 
  return {
    page,
    limit,
    total,
    totalPages,
    data
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
