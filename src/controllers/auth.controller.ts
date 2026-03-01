import { Request, Response } from "express";
import { loginWithGoogle, registerWithPassword, loginWithPassword } from "@/services/auth.service";
import { successResponse, errorResponse } from "@/utils/response";

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
