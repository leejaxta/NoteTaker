const authService = require("../services/auth.service");
const { success } = require("../utils/apiResponse");
const logger = require("../utils/logger");

exports.signup = async (req, res, next) => {
  try {
    const user = await authService.signup(req.body);
    success(res, user, "User registered successfully");
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const token = await authService.login(req.body);
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, 
      sameSite: "strict", 
      maxAge: 3600000, 
    });
    success(res, { token }, "Login successful");
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  logger.info(`User logged out: ${req.user?.id || "unknown"}`);
  res.status(200).json({ message: "Logged out successfully" });
};

exports.me = async (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
  });
};
