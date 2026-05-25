import { MsWeapon } from "@prisma/client";

export interface ShopResult {
  limitedItems: MsWeapon[];
  legendary: MsWeapon[];
}
