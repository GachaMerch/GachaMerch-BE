import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "@/config/prisma";
import { AuthResult, UpdateProfileInput } from "@/types/auth.types";

const hashPassword = (password: string): string =>
  crypto.createHash("sha256").update(password).digest("hex");

const makeToken = (userId: number, email: string | null, roleId: number): string =>
  jwt.sign({ userId, email, roleId }, process.env.JWT_SECRET as string, { expiresIn: "7d" });

export const registerWithPassword = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResult> => {
  const existing = await prisma.msUser.findFirst({
    where: { OR: [{ Email: email }, { Username: username }] },
  });

  if (existing) {
    throw new Error("Email or username already registered");
  }

  const user = await prisma.msUser.create({
    data: {
      Username: username,
      Email: email,
      Password: hashPassword(password),
      RoleId: 2,
      Coin: 1000,
      Stsrc: "A",
      CreatedAt: new Date(),
      CreatedBy: email,
    },
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
  const user = await prisma.msUser.findFirst({
    where: {
      AND: [
        { OR: [{ Username: usernameOrEmail }, { Email: usernameOrEmail }] },
        { Stsrc: "A" },
      ],
    },
  });

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

  let user = await prisma.msUser.findFirst({
    where: {
      OR: [{ GoogleId: googleId }, { Email: email }],
    },
  });

  if (!user) {
    user = await prisma.msUser.create({
      data: {
        Username: name ?? email,
        Email: email,
        GoogleId: googleId,
        Avatar: picture ?? null,
        RoleId: 2,
        Coin: 1000,
        Stsrc: "A",
        CreatedAt: new Date(),
        CreatedBy: email,
      },
    });
  } else if (!user.GoogleId) {
    user = await prisma.msUser.update({
      where: { UserId: user.UserId },
      data: { GoogleId: googleId, UpdatedAt: new Date(), UpdatedBy: email },
    });
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
  const user = await prisma.msUser.findUnique({
    where: { UserId: userId },
    select: {
      UserId: true,
      Username: true,
      Email: true,
      Avatar: true,
      RoleId: true,
      Coin: true,
    },
  });

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

  const user = await prisma.msUser.update({
    where: { UserId: userId },
    data,
    select: {
      UserId: true,
      Username: true,
      Email: true,
      Avatar: true,
      RoleId: true,
      Coin: true,
    },
  });

  return {
    userId: user.UserId,
    username: user.Username,
    email: user.Email,
    avatar: user.Avatar,
    roleId: user.RoleId,
    coin: user.Coin,
  };
};
