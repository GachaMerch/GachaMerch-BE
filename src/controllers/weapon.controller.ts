import { Request, Response } from "express";
import { getWeapons } from "@/services/weapon.service";
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
