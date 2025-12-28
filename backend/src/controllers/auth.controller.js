const authService = require("../services/auth.service");
const { success } = require("../utils/apiResponse");
const logger = require("../utils/logger");

exports.signup = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const { otpToken, signupToken } = await authService.signupWithOtp({
      name,
      email,
      password,
    });

    res.cookie("otpToken", otpToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 10 * 60 * 1000,
    });

    res.cookie("signupToken", signupToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 15 * 60 * 1000,
    });
    success(res, "OTP sent to email");
  } catch (err) {
    next(err);
  }
};

exports.resendOtp = async (req, res, next) => {
  const signupToken = req.cookies?.signupToken;
  try {
    const { otpToken } = await authService.resendOtp({ signupToken });
    res.cookie("otpToken", otpToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
      maxAge: 10 * 60 * 1000,
    });
    success(res, "OTP sent to email");
  } catch (err) {
    next(err);
  }
};

exports.verifyOtp = async (req, res, next) => {
  const { otp } = req.body;
  const otpToken = req.cookies?.otpToken;
  const signupToken = req.cookies?.signupToken;
  try {
    const user = await authService.verifyOtpAndRegister({
      otp,
      otpToken,
      signupToken,
    });
    res.clearCookie("otpToken");
    res.clearCookie("signupToken");
    success(res, user, "Email verified and user registered successfully");
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
  success(res, "Logged out successfully");
};

exports.me = async (req, res) => {
  res.json({
    id: req.user.id,
    email: req.user.email,
    name: req.user.name,
  });
};
