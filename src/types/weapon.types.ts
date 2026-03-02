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

export interface UpdateWeaponParams {
  title?: string;
  type?: string;
  imagePath?: string;
  rarity?: number;
  baseAtk?: number;
  price?: number;
  discount?: number;
  subStat?: string;
  passiveName?: string;
  description?: string;
}

export interface CreateWeaponParams {
  title: string;
  type: string;
  imagePath: string;
  rarity: number;
  baseAtk: number;
  price: number;
  discount?: number;
  subStat?: string;
  passiveName?: string;
  description?: string;
}
