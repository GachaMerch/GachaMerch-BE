import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { AuthResult, UpdateProfileInput } from "./auth.types";
import {
  attachGoogleId,
  createGoogleUser,
  createPasswordUser,
  findActiveUserByUsernameOrEmail,
  findUserByEmailOrUsername,
  findUserByGoogleIdOrEmail,
  findUserProfileById,
  updateUserProfile,
} from "./auth.repository";

const hashPassword = (password: string): string =>
  crypto.createHash("sha256").update(password).digest("hex");

const makeToken = (userId: number, email: string | null, roleId: number): string =>
  jwt.sign({ userId, email, roleId }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

export const registerWithPassword = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResult> => {
  const existing = await findUserByEmailOrUsername(email, username);

  if (existing) {
    throw new Error("Email or username already registered");
  }

  const user = await createPasswordUser({
    username,
    email,
    password: hashPassword(password),
  });

  return {
    token: makeToken(user.UserId, user.Email, user.RoleId),
    user: {
      userId: user.UserId,
      username: user.Username,
      email: user.Email,
      avatar: user.Avatar,
      roleId: user.RoleId,
      coin: user.Coin,
    },
  };
};

export const loginWithPassword = async (
  usernameOrEmail: string,
  password: string
): Promise<AuthResult> => {
  const user = await findActiveUserByUsernameOrEmail(usernameOrEmail);

  if (!user || user.Password !== hashPassword(password)) {
    throw new Error("Invalid credentials");
  }

  return {
    token: makeToken(user.UserId, user.Email, user.RoleId),
    user: {
      userId: user.UserId,
      username: user.Username,
      email: user.Email,
      avatar: user.Avatar,
      roleId: user.RoleId,
      coin: user.Coin,
    },
  };
};

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginWithGoogle = async (idToken: string): Promise<AuthResult> => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error("Invalid Google token");
  }

  const { sub: googleId, email, name, picture } = payload;

  let user = await findUserByGoogleIdOrEmail(googleId, email);

  if (!user) {
    user = await createGoogleUser({
      username: name ?? email,
      email,
      googleId,
      avatar: picture ?? null,
    });
  } else if (!user.GoogleId) {
    user = await attachGoogleId(user.UserId, googleId, email);
  }

  return {
    token: makeToken(user.UserId, user.Email, user.RoleId),
    user: {
      userId: user.UserId,
      username: user.Username,
      email: user.Email,
      avatar: user.Avatar,
      roleId: user.RoleId,
      coin: user.Coin,
    },
  };
};

export const getMe = async (userId: number) => {
  const user = await findUserProfileById(userId);

  if (!user) throw new Error("User not found");

  return {
    userId: user.UserId,
    username: user.Username,
    email: user.Email,
    avatar: user.Avatar,
    roleId: user.RoleId,
    coin: user.Coin,
  };
};

export const updateProfile = async (
  userId: number,
  email: string,
  input: UpdateProfileInput
) => {
  const data: Record<string, unknown> = {
    Username: input.username,
    UpdatedAt: new Date(),
    UpdatedBy: email,
  };

  if (input.password) {
    data.Password = hashPassword(input.password);
  }

  const user = await updateUserProfile(userId, data);

  return {
    userId: user.UserId,
    username: user.Username,
    email: user.Email,
    avatar: user.Avatar,
    roleId: user.RoleId,
    coin: user.Coin,
  };
};
