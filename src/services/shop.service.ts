import { prisma } from "@/config/prisma";
import { ShopResult } from "@/types/shop.types";

export const getShopItems = async (): Promise<ShopResult> => {
  const [legendary, limitedItems] = await Promise.all([
    prisma.msWeapon.findMany({
      where: { Stsrc: "A", Rarity: { gte: 5 } },
      orderBy: { Rarity: "desc" },
    }),
    prisma.msWeapon.findMany({
      where: { Stsrc: "A", Rarity: { equals: 4 } },
      orderBy: { WeaponId: "desc" },
    }),
  ]);

  return { legendary, limitedItems };
};
