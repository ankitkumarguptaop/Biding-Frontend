import { Status } from "./item.slice";


export const createItemType = "item/createItem";
export const listItemType = "item/listItem";
export const getItemType = "item/getItem";

export interface filters{
    status?: Status;
}