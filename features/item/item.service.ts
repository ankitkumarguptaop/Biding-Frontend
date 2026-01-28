import { axiosInstance } from "@/lib/axios";
import { Status } from "./item.slice";

export const listItem = (data?: Status) => {
  return axiosInstance.get("/items", { params: {status: data} });
};

export const getItem = (id: string) => {
  return axiosInstance.get(`/items/${id}`);
};

export const createItem = (data: FormData) => {
  return axiosInstance.post("/items", data);
}