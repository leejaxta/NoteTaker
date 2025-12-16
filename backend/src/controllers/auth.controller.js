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
    success(res, { token }, "Login successful");
  } catch (err) {
    next(err);
  }
};
