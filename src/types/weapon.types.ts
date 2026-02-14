import { MsWeapon } from "@prisma/client";

export interface GetWeaponsParams {
  page: number;
  limit: number;
}

export interface GetWeaponsResult {
  weapons: MsWeapon[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
