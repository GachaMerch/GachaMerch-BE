import { Request, Response } from "express";
import * as orderService from "../services/order.service";

export const createBookingHandler = async (req: Request, res: Response) => {
    try {
        const { googleId , weaponId } = req.body;

        if (!googleId || !weaponId) {
            return res.status(400).json({ message: "User ID and Weapon ID are required." });
        }

    const result = await orderService.purchaseWeapon(googleId, weaponId);

    res.status(200).json({
    success: true,
    message: "Weapon purchased successfully!",
    data: result
    });
    } catch (error: any) {
    // Return the specific error (e.g., "Insufficient coins") to Flutter
    res.status(400).json({ success: false, message: error.message });
  }
};