import { prisma } from "@/config/prisma";


export const purchaseWeapon = async (googleId: string, weaponId: number) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Fetch Weapon and User details
    const weapon = await tx.msWeapon.findUnique({
      where: { WeaponId: weaponId }
    });

    const user = await tx.msUser.findUnique({
      where: { GoogleId: googleId }
    });

    if (!weapon || weapon.Stsrc !== 'A') throw new Error("Weapon not found or unavailable.");
    if (!user) throw new Error("User not found.");

    // 2. Calculate Final Price
    const price = Number(weapon.Price);
    const discount = Number(weapon.DiscountAmount || 0);
    const finalPrice = price - discount;

    // 3. Validation: Check if user has enough coins
    if (user.Coin < finalPrice) {
      throw new Error(`Insufficient coins. You need ${finalPrice} but only have ${user.Coin}.`);
    }

    // 4. Deduct Coins from User
    await tx.msUser.update({
      where: { GoogleId: googleId },
      data: { Coin: { decrement: Math.floor(finalPrice) } }
    });

    // 5. Create the Order & Detail (Instant Receipt)
    const order = await tx.trOrder.create({
      data: {
        UserId: user.UserId,
        TotalPrice: finalPrice,
        Stsrc: 'A',
        CreatedBy: "GenshinImportSystem",
        OrderDetail: {
          create: {
            WeaponId: weaponId,
            Quantity: 1,
            UnitPrice: price,
            DiscountAmount: discount,
            TotalPrice: finalPrice,
            Stsrc: 'A',
            CreatedBy: "GenshinImportSystem"
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