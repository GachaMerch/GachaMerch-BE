import { Router } from "express";
import { getInventoryHandler } from "./inventory.controller";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

/**
 * @swagger
 * /api/inventory:
 *   get:
 *     summary: Get current user's weapon inventory
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Inventory fetched successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/", authenticate, getInventoryHandler);

export default router;
