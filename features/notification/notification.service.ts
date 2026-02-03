import { axiosInstance } from "@/lib/axios";

export const listNotifications = () => {
  return axiosInstance.get("/notifications");
};

export const markAllRead = () => {
  return axiosInstance.patch("/notifications");
};

export const markAsRead = (notificationId: string) => {
  return axiosInstance.patch(`/notifications/${notificationId}`);
};
