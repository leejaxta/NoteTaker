const { jwtSecret, jwtExpiresIn } = require("../config/env");
const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

exports.signupWithOtp = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw { status: 400, message: "All fields are required" };
  }

  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [
    email,
  ]);
  if (existing.length > 0) {
    throw { status: 409, message: "Email already registered" };
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpToken = jwt.sign({ email, otp }, jwtSecret, { expiresIn: "10m" });

  const signupToken = jwt.sign({ name, email, password }, jwtSecret, {
    expiresIn: "15m",
  });

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Verify Email" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your OTP Code",
    text: `Your OTP is: ${otp}. It is valid for 10 minutes.`,
    html: `
      <p>Your OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });

  return { otpToken, signupToken };
};

exports.resendOtp = async ({ signupToken }) => {
  if (!signupToken) {
    throw { status: 401, message: "Signup session expired" };
  }

  let payload;
  try {
    payload = jwt.verify(signupToken, jwtSecret);
  } catch {
    throw { status: 401, message: "Signup session expired" };
  }

  const { email } = payload;

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const otpToken = jwt.sign({ email, otp }, jwtSecret, { expiresIn: "10m" });

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Verify Email" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your new OTP code",
    text: `Your OTP is ${otp}`,
    html: `
      <p>Your new OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP is valid for 10 minutes.</p>
    `,
  });

  return { otpToken };
};

exports.verifyOtpAndRegister = async ({ otp, otpToken, signupToken }) => {
  try {
    const otpPayload = jwt.verify(otpToken, jwtSecret);
    const signupPayload = jwt.verify(signupToken, jwtSecret);

    if (otpPayload.otp !== otp) {
      throw { status: 400, message: "Invalid OTP" };
    }

    if (otpPayload.email !== signupPayload.email) {
      throw { status: 400, message: "Token mismatch" };
    }

    const passwordHash = await bcrypt.hash(signupPayload.password, 10);

    const [result] = await pool.query(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [signupPayload.name, signupPayload.email, passwordHash]
    );

    return {
      id: result.insertId,
      name: signupPayload.name,
      email: signupPayload.email,
    };
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      throw { status: 400, message: "OTP expired" };
    }
    throw err;
  }
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

  const token = jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    jwtSecret,
    {
      expiresIn: jwtExpiresIn,
    }
  );

  return token;
};
