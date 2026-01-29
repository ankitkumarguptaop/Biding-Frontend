export interface BidPayload {
    itemId: string;
    bidAmount: number;
}
export const createBidType = "bid/createBid";
export const listBidType = "bid/listBid";
