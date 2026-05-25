import { Request, Response } from "express";
import { getShopItems } from "./shop.service";
import { successResponse, errorResponse } from "@/utils/response";

export const getShopHandler = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await getShopItems();
    successResponse(res, result, "Shop items retrieved successfully");
  } catch (error) {
    console.error("Error fetching shop items:", error);
    errorResponse(res, "Failed to fetch shop items", 500);
  }
};
