import { prisma } from "@/config/prisma";

export const getInventory = async (userId: number) => {
  const items = await prisma.trInventory.findMany({
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

  return items.map((item) => ({
    inventoryId: item.InventoryId,
    quantity: item.Quantity,
    acquiredAt: item.CreatedAt,
    weapon: item.Weapon,
  }));
};
