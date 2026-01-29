import { axiosInstance } from "@/lib/axios";
import { BidPayload } from "./bid.type";


export const createBid = (data: BidPayload) => {
  return axiosInstance.post("/bids", data);
};

export const listBid = () => {
  return axiosInstance.get("/bids");
};