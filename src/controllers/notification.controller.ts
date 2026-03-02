import { Request, Response } from "express";
import { getNotifications } from "@/services/notification.service";
import { successResponse, errorResponse } from "@/utils/response";

export const getNotificationsHandler = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const result = await getNotifications();
    successResponse(res, result, "Notifications retrieved successfully");
  } catch (error) {
    console.error("Error fetching notifications:", error);
    errorResponse(res, "Failed to fetch notifications", 500);
  }
};
