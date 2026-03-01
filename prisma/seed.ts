import { prisma } from "@/config/prisma";
import fs from "fs";
import path from "path";

interface WeaponData {
  name: string;
  type: string;
  image: string;
  rarity: number;
  baseAttack: number;
  subStat: string;
  passiveName: string;
  passiveDesc: string;
  location: string;
  ascensionMaterial: string;
}

async function main() {
  const assetsPath = path.join(__dirname, "../assets/data");

  const weaponFolders = fs.readdirSync(assetsPath).filter((item) => {
    const itemPath = path.join(assetsPath, item);
    return fs.statSync(itemPath).isDirectory();
  });

  console.log(`Found ${weaponFolders.length} weapon folders`);

  for (const folderName of weaponFolders) {
    const folderPath = path.join(assetsPath, folderName);
    const jsonPath = path.join(folderPath, "en.json");

    if (!fs.existsSync(jsonPath)) {
      console.log(`⚠️  Skipping ${folderName} - no en.json found`);
      continue;
    }

    const jsonData = fs.readFileSync(jsonPath, "utf-8");
    const weaponData: WeaponData = JSON.parse(jsonData);

    const imageFolderPath = path.join(__dirname, "../assets/image", folderName);
    const iconPath = path.join(imageFolderPath, "icon");
    const imagePath = fs.existsSync(iconPath)
      ? `/assets/image/${folderName}/icon`
      : "";

    try {
      await prisma.msWeapon.create({
        data: {
          Title: weaponData.name,
          Type: weaponData.type,
          Image: imagePath,
          Rarity: weaponData.rarity,
          BaseAtk: weaponData.baseAttack,
          SubStat: weaponData.subStat,
          PassiveName: weaponData.passiveName,
          PassiveDesc: weaponData.passiveDesc,
          Location: weaponData.location,
          AscensioMaterial: weaponData.ascensionMaterial,
          Price: 10,
          DiscountAmount: 0,
          Stsrc: "A",
          CreatedAt: new Date(),
          CreatedBy: "System",
          UpdatedAt: null,
          UpdatedBy: null,
        },
      });

      console.log(`✅ Inserted: ${weaponData.name} (${folderName})`);
    } catch (error) {
      console.error(`❌ Failed to insert ${weaponData.name}:`, error);
    }
  }

  console.log("\n🎉 Seed completed successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Error during seeding:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
