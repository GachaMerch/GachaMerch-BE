import { findActiveInventoryByUserId } from "./inventory.repository";

export const getInventory = async (userId: number) => {
  const items = await findActiveInventoryByUserId(userId);

  return items.map((item) => ({
    inventoryId: item.InventoryId,
    quantity: item.Quantity,
    acquiredAt: item.CreatedAt,
    weapon: item.Weapon,
  }));
};
