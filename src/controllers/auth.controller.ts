import { Request, Response } from "express";
import {
  loginWithGoogle,
  registerWithPassword,
  loginWithPassword,
  getMe,
  updateProfile,
} from "@/services/auth.service";
import { successResponse, errorResponse } from "@/utils/response";
import { AuthRequest } from "@/middlewares/auth.middleware";

export const googleAuthHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      errorResponse(res, "idToken is required", 400);
      return;
    }
    const result = await loginWithGoogle(idToken);
    successResponse(res, result, "Google authentication successful", 200);
  } catch (error) {
    console.error("Google auth error:", error);
    errorResponse(res, "Google authentication failed", 401);
  }
};

export const registerHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      errorResponse(res, "username, email, and password are required", 400);
      return;
    }
    const result = await registerWithPassword(username, email, password);
    successResponse(res, result, "Registration successful", 201);
  } catch (error: any) {
    if (error.message === "Email or username already registered") {
      errorResponse(res, error.message, 409);
    } else {
      console.error("Register error:", error);
      errorResponse(res, "Registration failed", 500);
    }
  }
};

export const loginHandler = async (req: Request, res: Response): Promise<void> => {
  try {
    const { usernameOrEmail, password } = req.body;
    if (!usernameOrEmail || !password) {
      errorResponse(res, "usernameOrEmail and password are required", 400);
      return;
    }
    const result = await loginWithPassword(usernameOrEmail, password);
    successResponse(res, result, "Login successful", 200);
  } catch (error: any) {
    if (error.message === "Invalid credentials") {
      errorResponse(res, "Invalid username/email or password", 401);
    } else {
      console.error("Login error:", error);
      errorResponse(res, "Login failed", 500);
    }
  }
};

export const getMeHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const user = await getMe(userId);
    successResponse(res, user, "User fetched successfully", 200);
  } catch (error: any) {
    if (error.message === "User not found") {
      errorResponse(res, "User not found", 404);
    } else {
      console.error("Get me error:", error);
      errorResponse(res, "Failed to fetch user", 500);
    }
  }
};

export const updateProfileHandler = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { username, password } = req.body;

    if (!username || typeof username !== "string" || username.trim() === "") {
      errorResponse(res, "username is required", 400);
      return;
    }
    if (password !== undefined && password.length < 8) {
      errorResponse(res, "Password must be at least 8 characters", 400);
      return;
    }

    const email = req.user!.email ?? "";
    const updated = await updateProfile(userId, email, {
      username: username.trim(),
      password,
    });
    successResponse(res, updated, "Profile updated successfully", 200);
  } catch (error: any) {
    console.error("Update profile error:", error);
    errorResponse(res, "Failed to update profile", 500);
  }
};
