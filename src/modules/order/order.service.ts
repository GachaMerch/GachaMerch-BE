import { commitWeaponPurchase, findUserById, findWeaponById } from "./order.repository";

export const purchaseWeapon = async (
  userId: number,
  weaponId: number,
  quantity: number = 1
) => {
  const weapon = await findWeaponById(weaponId);
  const user = await findUserById(userId);

  if (!weapon || weapon.Stsrc !== "A") throw new Error("Weapon not found or unavailable.");
  if (!user) throw new Error("User not found.");
  if (quantity < 1) throw new Error("Quantity must be at least 1.");
  if (weapon.Stock < quantity) throw new Error(`Insufficient stock. Only ${weapon.Stock} left.`);

  const unitPrice = Number(weapon.Price) - Number(weapon.DiscountAmount || 0);
  const totalPrice = unitPrice * quantity;

  if (user.Coin < totalPrice) {
    throw new Error(`Insufficient coins. Need ${totalPrice} but only have ${user.Coin}.`);
  }

  const now = new Date();
  const createdBy = user.Email || String(userId);

  const { order, updatedUser } = await commitWeaponPurchase({
    userId,
    weaponId,
    quantity,
    unitPrice: Number(weapon.Price),
    discountAmount: Number(weapon.DiscountAmount || 0),
    totalPrice,
    createdBy,
    now,
  });

  return {
    orderId: order.OrderId,
    weaponTitle: weapon.Title,
    quantity,
    totalPrice,
    remainingCoins: updatedUser.Coin,
  };
};
