import { prisma } from "@/config/prisma";
import { NotificationItem } from "@/types/notification.types";

export const getNotifications = async (): Promise<NotificationItem[]> => {
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
