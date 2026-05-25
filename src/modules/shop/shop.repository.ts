import { prisma } from "@/config/prisma";

export const findLegendaryShopWeapons = () => {
  return prisma.msWeapon.findMany({
    where: { Stsrc: "A", Rarity: { gte: 5 } },
    orderBy: { Rarity: "desc" },
  });
};

export const findLimitedShopWeapons = () => {
  return prisma.msWeapon.findMany({
    where: { Stsrc: "A", Rarity: { equals: 4 } },
    orderBy: { WeaponId: "desc" },
  });
};
