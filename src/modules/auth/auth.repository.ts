import { prisma } from "@/config/prisma";

const userProfileSelect = {
  UserId: true,
  Username: true,
  Email: true,
  Avatar: true,
  RoleId: true,
  Coin: true,
};

export const findUserByEmailOrUsername = (email: string, username: string) => {
  return prisma.msUser.findFirst({
    where: { OR: [{ Email: email }, { Username: username }] },
  });
};

export const createPasswordUser = (params: {
  username: string;
  email: string;
  password: string;
}) => {
  return prisma.msUser.create({
    data: {
      Username: params.username,
      Email: params.email,
      Password: params.password,
      RoleId: 2,
      Coin: 1000,
      Stsrc: "A",
      CreatedAt: new Date(),
      CreatedBy: params.email,
    },
  });
};

export const findActiveUserByUsernameOrEmail = (usernameOrEmail: string) => {
  return prisma.msUser.findFirst({
    where: {
      AND: [
        { OR: [{ Username: usernameOrEmail }, { Email: usernameOrEmail }] },
        { Stsrc: "A" },
      ],
    },
  });
};

export const findUserByGoogleIdOrEmail = (googleId: string, email: string) => {
  return prisma.msUser.findFirst({
    where: {
      OR: [{ GoogleId: googleId }, { Email: email }],
    },
  });
};

export const createGoogleUser = (params: {
  username: string;
  email: string;
  googleId: string;
  avatar: string | null;
}) => {
  return prisma.msUser.create({
    data: {
      Username: params.username,
      Email: params.email,
      GoogleId: params.googleId,
      Avatar: params.avatar,
      RoleId: 2,
      Coin: 1000,
      Stsrc: "A",
      CreatedAt: new Date(),
      CreatedBy: params.email,
    },
  });
};

export const attachGoogleId = (userId: number, googleId: string, email: string) => {
  return prisma.msUser.update({
    where: { UserId: userId },
    data: { GoogleId: googleId, UpdatedAt: new Date(), UpdatedBy: email },
  });
};

export const findUserProfileById = (userId: number) => {
  return prisma.msUser.findUnique({
    where: { UserId: userId },
    select: userProfileSelect,
  });
};

export const updateUserProfile = (
  userId: number,
  data: Record<string, unknown>
) => {
  return prisma.msUser.update({
    where: { UserId: userId },
    data,
    select: userProfileSelect,
  });
};
