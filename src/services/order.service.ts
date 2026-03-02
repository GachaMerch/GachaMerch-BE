import { prisma } from "@/config/prisma";

export const purchaseWeapon = async (
  userId: number,
  weaponId: number,
  quantity: number = 1
) => {
  const weapon = await prisma.msWeapon.findUnique({ where: { WeaponId: weaponId } });
  const user = await prisma.msUser.findUnique({ where: { UserId: userId } });

  if (!weapon || weapon.Stsrc !== "A") throw new Error("Weapon not found or unavailable.");
  if (!user) throw new Error("User not found.");
  if (quantity < 1) throw new Error("Quantity must be at least 1.");

  const unitPrice = Number(weapon.Price) - Number(weapon.DiscountAmount || 0);
  const totalPrice = unitPrice * quantity;

  if (user.Coin < totalPrice) {
    throw new Error(
      `Insufficient coins. Need ${totalPrice} but only have ${user.Coin}.`
    );
  }

  const updatedUser = await prisma.msUser.update({
    where: { UserId: userId },
    data: { Coin: { decrement: Math.floor(totalPrice) } },
  });

  const now = new Date();
  const createdBy = user.Username || String(userId);

  const order = await prisma.trOrder.create({
    data: {
      UserId: user.UserId,
      TotalPrice: totalPrice,
      Stsrc: "A",
      CreatedAt: now,
      CreatedBy: createdBy,
      OrderDetail: {
        create: {
          WeaponId: weaponId,
          Quantity: quantity,
          UnitPrice: Number(weapon.Price),
          DiscountAmount: Number(weapon.DiscountAmount || 0),
          TotalPrice: totalPrice,
          Stsrc: "A",
          CreatedAt: now,
          CreatedBy: createdBy,
        },
      },
    },
    include: { OrderDetail: true },
  });

  return {
    orderId: order.OrderId,
    weaponTitle: weapon.Title,
    quantity,
    totalPrice,
    remainingCoins: updatedUser.Coin,
  };
};
