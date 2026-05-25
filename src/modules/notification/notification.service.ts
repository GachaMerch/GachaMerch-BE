import { NotificationItem } from "./notification.types";
import { findActiveNotifications } from "./notification.repository";

export const getNotifications = async (): Promise<NotificationItem[]> => {
  return findActiveNotifications();
};
