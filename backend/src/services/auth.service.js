const { jwtSecret, jwtExpiresIn } = require("../config/env");
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

exports.signup = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw { status: 400, message: "All fields are required" };
  }

  // Check if user exists
  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [
    email,
  ]);

  if (existing.length > 0) {
    throw { status: 409, message: "Email already registered" };
  }

  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);

  // Insert user
  const [result] = await pool.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, passwordHash]
  );

  logger.info("New user registered: %s", email);

  return {
    id: result.insertId,
    name,
    email,
  };
};

exports.login = async ({ email, password }) => {
  if (!email || !password) {
    throw { status: 400, message: "Email and password are required" };
  }

  const [rows] = await pool.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = ?",
    [email]
  );

  if (rows.length === 0) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const user = rows[0];

  const isMatch = await bcrypt.compare(password, user.password_hash);
  if (!isMatch) {
    throw { status: 401, message: "Invalid email or password" };
  }

  const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
    expiresIn: jwtExpiresIn,
  });

  return token;
};
