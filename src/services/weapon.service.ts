import { prisma } from "@/config/prisma";
import { GetWeaponsParams, GetWeaponsResult } from "@/types/weapon.types";

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
