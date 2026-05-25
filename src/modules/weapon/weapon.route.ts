import { Router } from "express";
import multer from "multer";
import { getWeaponsHandler, createWeaponHandler, updateWeaponHandler, deleteWeaponHandler } from "./weapon.controller";
import { validate } from "@/middlewares/validate";
import { getWeaponsSchema } from "./weapon.validation";

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

/**
 * @swagger
 * /api/weapons:
 *   get:
 *     summary: Get all weapons with pagination
 *     tags: [Weapons]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of weapons retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Weapons retrieved successfully
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Weapon'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", validate(getWeaponsSchema), getWeaponsHandler);

/**
 * @swagger
 * /api/weapons:
 *   post:
 *     summary: Create a new weapon (Admin only)
 *     tags: [Weapons]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, type, rarity, baseAtk, price]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Aquila Favonia
 *               type:
 *                 type: string
 *                 example: Sword
 *               rarity:
 *                 type: integer
 *                 example: 5
 *               baseAtk:
 *                 type: number
 *                 example: 48.0
 *               price:
 *                 type: number
 *                 example: 100000
 *               discount:
 *                 type: number
 *                 example: 0
 *               subStat:
 *                 type: string
 *                 example: Physical DMG Bonus
 *               passiveName:
 *                 type: string
 *                 example: Falcon's Defiance
 *               description:
 *                 type: string
 *                 example: ATK is increased by 20%...
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Weapon created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Weapon'
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", upload.single("image"), createWeaponHandler);

/**
 * @swagger
 * /api/weapons/{id}:
 *   put:
 *     summary: Update an existing weapon (Admin only)
 *     tags: [Weapons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Weapon ID
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Aquila Favonia
 *               type:
 *                 type: string
 *                 example: Sword
 *               rarity:
 *                 type: integer
 *                 example: 5
 *               baseAtk:
 *                 type: number
 *                 example: 48.0
 *               price:
 *                 type: number
 *                 example: 100000
 *               discount:
 *                 type: number
 *                 example: 0
 *               subStat:
 *                 type: string
 *                 example: Physical DMG Bonus
 *               passiveName:
 *                 type: string
 *                 example: Falcon's Defiance
 *               description:
 *                 type: string
 *                 example: ATK is increased by 20%...
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Weapon updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Weapon'
 *       400:
 *         description: Invalid weapon ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete a weapon by ID (Admin only)
 *     tags: [Weapons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Weapon ID
 *     responses:
 *       200:
 *         description: Weapon deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Invalid weapon ID
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:id", upload.single("image"), updateWeaponHandler);
router.delete("/:id", deleteWeaponHandler);

export default router;
