import { ShopResult } from "./shop.types";
import { findLegendaryShopWeapons, findLimitedShopWeapons } from "./shop.repository";

export const getShopItems = async (): Promise<ShopResult> => {
  const [legendary, limitedItems] = await Promise.all([
    findLegendaryShopWeapons(),
    findLimitedShopWeapons(),
  ]);

  return { legendary, limitedItems };
};
