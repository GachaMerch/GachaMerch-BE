import { prisma } from "@/config/prisma";


export const purchaseWeapon = async (googleId: string, weaponId: number) => {
  return await prisma.$transaction(async (tx) => {
    const weapon = await tx.msWeapon.findUnique({
      where: { WeaponId: weaponId }
    });

    const user = await tx.msUser.findUnique({
      where: { GoogleId: googleId }
    });

    if (!weapon || weapon.Stsrc !== 'A') throw new Error("Weapon not found or unavailable.");
    if (!user) throw new Error("User not found.");

    const price = Number(weapon.Price);
    const discount = Number(weapon.DiscountAmount || 0);
    const finalPrice = price - discount;

    if (user.Coin < finalPrice) {
      throw new Error(`Insufficient coins. You need ${finalPrice} but only have ${user.Coin}.`);
    }

    await tx.msUser.update({
      where: { GoogleId: googleId },
      data: { Coin: { decrement: Math.floor(finalPrice) } }
    });

    const now = new Date();
    const createdBy = user.Username || user.GoogleId || googleId;
    const order = await tx.trOrder.create({
      data: {
        UserId: user.UserId,
        TotalPrice: finalPrice,
        Stsrc: 'A',
        CreatedAt: now,
        CreatedBy: createdBy,
        OrderDetail: {
          create: {
            WeaponId: weaponId,
            Quantity: 1,
            UnitPrice: price,
            DiscountAmount: discount,
            TotalPrice: finalPrice,
            Stsrc: 'A',
            CreatedAt: now,
            CreatedBy: createdBy
          }
        }
      },
      include: {
        OrderDetail: true
      }
    });

    return { order, remainingCoins: user.Coin - Math.floor(finalPrice) };
  });
};
