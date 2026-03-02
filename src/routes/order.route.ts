import { Router } from "express";
import { createBookingHandler } from "@/controllers/order.controller";
;
const router = Router();

/**
 * @swagger
 *  /api/order/buy:
 *   post:
 *     summary: Purchase a weapon using in-game coins
 *     tags: [Order]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [googleId , weaponId]
 *             properties:
 *               googleId:
 *                 type: string
 *                 description: Google ID of the user purchasing the weapon
 *               weaponId:
 *                 type: integer
 *                 description: ID of the weapon to purchase
 *     responses:
 *       201:
 *         description: Weapon purchased successfully
 *       400:
 *         description: Insufficient coins or invalid weapon
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *       404:
 *         description: User or Weapon not found
 */

router.post("/buy" , createBookingHandler);

export default router;