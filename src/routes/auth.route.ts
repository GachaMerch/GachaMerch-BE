import { Router } from "express";
import { googleAuthHandler, registerHandler, loginHandler } from "@/controllers/auth.controller";

const router = Router();

/**
 * @swagger
 * /api/auth/google:
 *   post:
 *     summary: Login or register with Google OAuth
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [idToken]
 *             properties:
 *               idToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Authentication successful, returns JWT token and user data
 *       401:
 *         description: Authentication failed
 */
router.post("/google", googleAuthHandler);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register with username, email, and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username, email, password]
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       201:
 *         description: Registration successful
 *       409:
 *         description: Email or username already registered
 */
router.post("/register", registerHandler);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login with username/email and password
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [usernameOrEmail, password]
 *             properties:
 *               usernameOrEmail:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token and user data
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", loginHandler);

export default router;
