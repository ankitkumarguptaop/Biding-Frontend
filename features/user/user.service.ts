import { axiosInstance } from "@/lib/axios";
import { SignInPayload, SignUpPayload } from "./user.type";

export const signIn = (data: SignInPayload) => {
  return axiosInstance.post("/users/signin", data);
};

export const signUp = (data: SignUpPayload | FormData) => {
  return axiosInstance.post("/users/signup", data);
};
