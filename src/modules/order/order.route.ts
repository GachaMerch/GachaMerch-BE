import { Router } from "express";
import { createBookingHandler } from "./order.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/order/buy:
 *   post:
 *     summary: Purchase a weapon using in-game coins
 *     tags: [Order]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [weaponId]
 *             properties:
 *               weaponId:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Weapon purchased successfully
 *       400:
 *         description: Insufficient coins or invalid input
 *       401:
 *         description: Unauthorized
 */
router.post("/buy", authenticate, createBookingHandler);

export default router;
