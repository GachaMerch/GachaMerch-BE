import { Response } from "express";
import * as orderService from "@/services/order.service";
import { AuthRequest } from "@/middlewares/auth.middleware";
import { successResponse, errorResponse } from "@/utils/response";

export const createBookingHandler = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { weaponId, quantity = 1 } = req.body;

    if (!weaponId) {
      errorResponse(res, "weaponId is required", 400);
      return;
    }

    const qty = Number(quantity);
    if (isNaN(qty) || qty < 1) {
      errorResponse(res, "quantity must be a positive integer", 400);
      return;
    }

    const result = await orderService.purchaseWeapon(userId, Number(weaponId), qty);
    successResponse(res, result, "Weapon purchased successfully!", 201);
  } catch (error: any) {
    errorResponse(res, error.message ?? "Purchase failed", 400);
  }
};
