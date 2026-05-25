import { prisma } from "@/config/prisma";

export const findActiveNotifications = () => {
  return prisma.msNotification.findMany({
    where: { Stsrc: "A" },
    select: {
      NotifId: true,
      Title: true,
      Content: true,
      Type: true,
      PublishedAt: true,
    },
    orderBy: { PublishedAt: "desc" },
  });
};
