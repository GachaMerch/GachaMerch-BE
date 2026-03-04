import { Router } from "express";
import { getShopHandler } from "@/controllers/shop.controller";

const router = Router();

/**
 * @swagger
 * /api/shop:
 *   get:
 *     summary: Get all shop items (limited & legendary weapons)
 *     tags: [Shop]
 *     responses:
 *       200:
 *         description: Shop items retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ShopItem'
 *       500:
 *         description: Failed to fetch shop items
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", getShopHandler);

export default router;
