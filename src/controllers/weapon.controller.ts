import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { getWeapons, createWeapon, updateWeapon, deleteWeapon } from "@/services/weapon.service";
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
    const { title, type, rarity, baseAtk, price, discount, subStat, passiveName, description } = req.body;

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
      discount: discount ? parseFloat(discount) : 0,
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

export const updateWeaponHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      errorResponse(res, "Invalid weapon ID", 400);
      return;
    }

    const { title, type, rarity, baseAtk, price, discount, subStat, passiveName, description } = req.body;

    let imagePath: string | undefined;
    if (req.file) {
      const slug = (title || `weapon-${id}`).toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
      const ext = path.extname(req.file.originalname) || ".png";
      const dir = path.join(process.cwd(), "assets", "image", slug);
      fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(path.join(dir, `icon${ext}`), req.file.buffer);
      imagePath = `/assets/image/${slug}/icon${ext}`;
    }

    const weapon = await updateWeapon(id, {
      title,
      type,
      imagePath,
      rarity:      rarity      !== undefined ? parseInt(rarity)      : undefined,
      baseAtk:     baseAtk     !== undefined ? parseFloat(baseAtk)   : undefined,
      price:       price       !== undefined ? parseFloat(price)      : undefined,
      discount:    discount    !== undefined ? parseFloat(discount)   : undefined,
      subStat,
      passiveName,
      description,
    });

    successResponse(res, weapon, "Weapon updated successfully", 200);
  } catch (error) {
    console.error("Error updating weapon:", error);
    errorResponse(res, "Failed to update weapon", 500);
  }
};

export const deleteWeaponHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      errorResponse(res, "Invalid weapon ID", 400);
      return;
    }
    await deleteWeapon(id);
    successResponse(res, null, "Weapon deleted successfully", 200);
  } catch (error) {
    console.error("Error deleting weapon:", error);
    errorResponse(res, "Failed to delete weapon", 500);
  }
};
