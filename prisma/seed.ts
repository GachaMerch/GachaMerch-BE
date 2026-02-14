import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.msWeapon.create({
    data: {
      Title: "s",
      Type: "s",
      Rarity: 1,
      BaseAtk: 1.0,
      SubStat: "s",
      PassiveName: "s",
      PassiveDesc: "s",
      Location: "s",
      AscensioMaterial: "s",
      Price: 10,
      DiscountAmount: 1,
      Stsrc: "A",
      CreatedAt: new Date(),
      CreatedBy: "System",
      UpdatedAt: null,
      UpdatedBy: null,
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
