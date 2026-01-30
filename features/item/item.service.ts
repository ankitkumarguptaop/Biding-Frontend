import { axiosInstance } from "@/lib/axios";
import { filters } from "./item.type";

export const listItem = (data?: filters) => {
  return axiosInstance.get("/items", { params: {status: data?.status, search: data?.search} });
};

export const getItem = (id: string) => {
  return axiosInstance.get(`/items/${id}`);
};

export const createItem = (data: FormData) => {
  return axiosInstance.post("/items", data);
}