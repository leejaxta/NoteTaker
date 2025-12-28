const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const auth = require("../middleware/auth.middleware");

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication APIs
 */

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Send Otp to email
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: OTP sent to emai
 *       409:
 *         description: Email already exists
 */
router.post("/signup", authController.signup);

/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP and register user
 *     description: |
 *       Verifies the OTP sent to the user's email using tokens stored in cookies.
 *       If verification succeeds, the user is registered.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [otp]
 *             properties:
 *               otp:
 *                 type: string
 *                 example: "123456"
 *     parameters:
 *       - in: cookie
 *         name: otpToken
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT containing OTP and email
 *       - in: cookie
 *         name: signupToken
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT containing signup details (name, email, password)
 *     responses:
 *       200:
 *         description: Email verified and user registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *       400:
 *         description: Invalid or expired OTP, or token mismatch
 *       500:
 *         description: Internal server error
 */
router.post("/verify-otp", authController.verifyOtp);

/**
 * @swagger
 * /auth/resend-otp:
 *   post:
 *     summary: Resend OTP to email
 *     description: |
 *       Resends a new OTP to the user's email using the signup session stored in cookies.
 *       Generates a new OTP token and sets it as an HTTP-only cookie.
 *     tags: [Auth]
 *     parameters:
 *       - in: cookie
 *         name: signupToken
 *         required: true
 *         schema:
 *           type: string
 *         description: JWT containing signup session information
 *     responses:
 *       200:
 *         description: OTP sent to email
 *       401:
 *         description: Signup session expired or invalid
 *       500:
 *         description: Internal server error
 */
router.post("/resend-otp", authController.resendOtp);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout the current user
 *     tags: [Auth]
 *     description: Clears the HttpOnly cookie to log out the user.
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Logged out successfully"
 *       401:
 *         description: User is not authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 */
router.post("/logout", authController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current logged-in user
 *     tags: [Auth]
 *     description: Returns the authenticated user's details using cookie-based authentication
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Authenticated user data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 name:
 *                   type: string
 *                   example: John Doe
 *       401:
 *         description: Unauthorized (not logged in)
 */

router.get("/me", auth, authController.me);

module.exports = router;
