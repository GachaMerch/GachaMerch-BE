import { Response } from "express";
import { AuthRequest } from "@/middlewares/auth.middleware";
import { getInventory } from "./inventory.service";
import { successResponse, errorResponse } from "@/utils/response";

export const getInventoryHandler = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const items = await getInventory(userId);
    return successResponse(res, items, "Inventory fetched successfully");
  } catch (error) {
    return errorResponse(res, (error as Error).message, 500);
  }
};
