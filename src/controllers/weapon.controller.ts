import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { getWeapons, createWeapon } from "@/services/weapon.service";
import { successResponse, errorResponse } from "@/utils/response";

export const getWeaponsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getWeapons({ page, limit });

    successResponse(res, result.weapons, "Weapons retrieved successfully", 200, {
      page: result.page,
      limit: result.limit,
      total: result.total,
      totalPages: result.totalPages,
    });
  } catch (error) {
    console.error("Error fetching weapons:", error);
    errorResponse(res, "Failed to fetch weapons", 500);
  }
};

export const createWeaponHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { title, type, rarity, baseAtk, price, subStat, passiveName, description } = req.body;

    if (!title || !type || !rarity || !baseAtk || !price) {
      errorResponse(res, "title, type, rarity, baseAtk, price are required", 400);
      return;
    }

    let imagePath = "";
    if (req.file) {
      const slug = title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const ext = path.extname(req.file.originalname) || ".png";
      const dir = path.join(process.cwd(), "assets", "image", slug);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `icon${ext}`), req.file.buffer);
      imagePath = `/assets/image/${slug}/icon${ext}`;
    }

    const weapon = await createWeapon({
      title,
      type,
      imagePath,
      rarity: parseInt(rarity),
      baseAtk: parseFloat(baseAtk),
      price: parseFloat(price),
      subStat,
      passiveName,
      description,
    });

    successResponse(res, weapon, "Weapon created successfully", 201);
  } catch (error) {
    console.error("Error creating weapon:", error);
    errorResponse(res, "Failed to create weapon", 500);
  }
};
