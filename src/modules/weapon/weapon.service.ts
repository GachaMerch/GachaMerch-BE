import { GetWeaponsParams, GetWeaponsResult, CreateWeaponParams, UpdateWeaponParams } from "./weapon.types";
import {
  countActiveWeapons,
  createWeaponRecord,
  findActiveWeapons,
  softDeleteWeaponRecord,
  updateWeaponRecord,
} from "./weapon.repository";

export const getWeapons = async ({
  page,
  limit,
}: GetWeaponsParams): Promise<GetWeaponsResult> => {
  const skip = (page - 1) * limit;

  const [weapons, total] = await Promise.all([
    findActiveWeapons(skip, limit),
    countActiveWeapons(),
  ]);

  return { weapons, total, page, limit, totalPages: Math.ceil(total / limit) };
};

export const createWeapon = async (params: CreateWeaponParams) => {
  return createWeaponRecord(params);
};

export const updateWeapon = async (id: number, params: UpdateWeaponParams) => {
  return updateWeaponRecord(id, params);
};

export const deleteWeapon = async (id: number) => {
  return softDeleteWeaponRecord(id);
};
