import { prisma } from "@/config/prisma";
import { GetWeaponsParams, GetWeaponsResult, CreateWeaponParams, UpdateWeaponParams } from "@/types/weapon.types";

export const getWeapons = async ({
  page,
  limit,
}: GetWeaponsParams): Promise<GetWeaponsResult> => {
  const skip = (page - 1) * limit;

  const [weapons, total] = await Promise.all([
    prisma.msWeapon.findMany({
      where: {
        Stsrc: "A",
      },
      skip,
      take: limit,
      orderBy: {
        WeaponId: "desc",
      },
    }),
    prisma.msWeapon.count({
      where: {
        Stsrc: "A",
      },
    }),
  ]);

  const totalPages = Math.ceil(total / limit);

  return {
    weapons,
    total,
    page,
    limit,
    totalPages,
  };
};

export const updateWeapon = async (id: number, params: UpdateWeaponParams) => {
  return prisma.msWeapon.update({
    where: { WeaponId: id },
    data: {
      ...(params.title       !== undefined && { Title:          params.title }),
      ...(params.type        !== undefined && { Type:           params.type }),
      ...(params.imagePath   !== undefined && { Image:          params.imagePath }),
      ...(params.rarity      !== undefined && { Rarity:         params.rarity }),
      ...(params.baseAtk     !== undefined && { BaseAtk:        params.baseAtk }),
      ...(params.price       !== undefined && { Price:          params.price }),
      ...(params.discount    !== undefined && { DiscountAmount: params.discount }),
      ...(params.subStat     !== undefined && { SubStat:        params.subStat }),
      ...(params.passiveName !== undefined && { PassiveName:    params.passiveName }),
      ...(params.description !== undefined && { PassiveDesc:    params.description }),
    },
  });
};

export const deleteWeapon = async (id: number) => {
  return prisma.msWeapon.update({
    where: { WeaponId: id },
    data: { Stsrc: "N" },
  });
};

export const createWeapon = async (params: CreateWeaponParams) => {
  return prisma.msWeapon.create({
    data: {
      Title: params.title,
      Type: params.type,
      Image: params.imagePath,
      Rarity: params.rarity,
      BaseAtk: params.baseAtk,
      SubStat: params.subStat ?? "",
      PassiveName: params.passiveName ?? "",
      PassiveDesc: params.description ?? "",
      Location: "",
      AscensioMaterial: "",
      Price: params.price,
      DiscountAmount: params.discount ?? 0,
      Stsrc: "A",
    },
  });
};
