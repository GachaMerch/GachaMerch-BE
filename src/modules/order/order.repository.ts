import { prisma } from "@/config/prisma";

export const findWeaponById = (weaponId: number) => {
  return prisma.msWeapon.findUnique({ where: { WeaponId: weaponId } });
};

export const findUserById = (userId: number) => {
  return prisma.msUser.findUnique({ where: { UserId: userId } });
};

export const commitWeaponPurchase = (params: {
  userId: number;
  weaponId: number;
  quantity: number;
  unitPrice: number;
  discountAmount: number;
  totalPrice: number;
  createdBy: string;
  now: Date;
}) => {
  return prisma.$transaction(async (tx) => {
    const updatedUser = await tx.msUser.update({
      where: { UserId: params.userId },
      data: { Coin: { decrement: Math.floor(params.totalPrice) } },
    });

    await tx.msWeapon.update({
      where: { WeaponId: params.weaponId },
      data: {
        Stock: { decrement: params.quantity },
        UpdatedAt: params.now,
        UpdatedBy: params.createdBy,
      },
    });

    const order = await tx.trOrder.create({
      data: {
        UserId: params.userId,
        TotalPrice: params.totalPrice,
        Stsrc: "A",
        CreatedAt: params.now,
        CreatedBy: params.createdBy,
        OrderDetail: {
          create: {
            WeaponId: params.weaponId,
            Quantity: params.quantity,
            UnitPrice: params.unitPrice,
            DiscountAmount: params.discountAmount,
            TotalPrice: params.totalPrice,
            Stsrc: "A",
            CreatedAt: params.now,
            CreatedBy: params.createdBy,
          },
        },
      },
      include: { OrderDetail: true },
    });

    await tx.trInventory.upsert({
      where: {
        UserId_WeaponId: {
          UserId: params.userId,
          WeaponId: params.weaponId,
        },
      },
      update: {
        Quantity: { increment: params.quantity },
        UpdatedAt: params.now,
        UpdatedBy: params.createdBy,
      },
      create: {
        UserId: params.userId,
        WeaponId: params.weaponId,
        Quantity: params.quantity,
        Stsrc: "A",
        CreatedAt: params.now,
        CreatedBy: params.createdBy,
      },
    });

    return { order, updatedUser };
  });
};
