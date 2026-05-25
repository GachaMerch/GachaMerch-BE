import { prisma } from "@/config/prisma";

export const findActiveInventoryByUserId = (userId: number) => {
  return prisma.trInventory.findMany({
    where: { UserId: userId, Stsrc: "A" },
    include: {
      Weapon: {
        select: {
          WeaponId: true,
          Title: true,
          Type: true,
          Image: true,
          Rarity: true,
          BaseAtk: true,
          SubStat: true,
          PassiveName: true,
          PassiveDesc: true,
        },
      },
    },
    orderBy: { CreatedAt: "desc" },
  });
};
