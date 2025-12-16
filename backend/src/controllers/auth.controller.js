const authService = require("../services/auth.service");
const { success } = require("../utils/apiResponse");

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
      httpOnly: true, // cannot be accessed via JS (security)
      secure: false, // set true if using HTTPS
      sameSite: "strict", // CSRF protection
      maxAge: 3600000, // 1 hour in milliseconds
    });
    success(res, { token }, "Login successful");
  } catch (err) {
    next(err);
  }
};
