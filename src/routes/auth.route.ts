import { Router } from "express";
import {
  googleAuthHandler,
  registerHandler,
  loginHandler,
  getMeHandler,
  updateProfileHandler,
} from "@/controllers/auth.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

router.post("/google", googleAuthHandler);
router.post("/register", registerHandler);
router.post("/login", loginHandler);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get current logged-in user data
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user data including coin balance
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authenticate, getMeHandler);

/**
 * @swagger
 * /api/auth/profile:
 *   patch:
 *     summary: Update profile (username and/or password)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [username]
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *                 minLength: 8
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.patch("/profile", authenticate, updateProfileHandler);

export default router;
