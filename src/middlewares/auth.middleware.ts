import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { errorResponse } from "@/utils/response";

export interface AuthRequest extends Request {
  user?: { userId: number; email: string | null; roleId: number };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    errorResponse(res, "Unauthorized", 401);
    return;
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: number; email: string | null; roleId: number };
    req.user = decoded;
    next();
  } catch {
    errorResponse(res, "Invalid or expired token", 401);
  }
};
