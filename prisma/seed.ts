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
  // Seed roles
  await prisma.trRole.upsert({
    where: { RoleId: 1 },
    update: {},
    create: {
      RoleId: 1,
      RoleName: "admin",
      Stsrc: "A",
      CreatedAt: new Date(),
      CreatedBy: "system",
    },
  });
  await prisma.trRole.upsert({
    where: { RoleId: 2 },
    update: {},
    create: {
      RoleId: 2,
      RoleName: "user",
      Stsrc: "A",
      CreatedAt: new Date(),
      CreatedBy: "system",
    },
  });
  console.log("✅ Roles seeded");

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
    const iconPng = path.join(imageFolderPath, "icon.png");
    const iconWebp = path.join(imageFolderPath, "icon.webp");
    const imagePath = fs.existsSync(iconPng)
      ? `/assets/image/${folderName}/icon.png`
      : fs.existsSync(iconWebp)
        ? `/assets/image/${folderName}/icon.webp`
        : "";

    try {
      await prisma.msWeapon.create({
        data: {
          Title: weaponData.name,
          Type: weaponData.type,
          Description: weaponData.passiveDesc || "",
          Stock: 100,
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

  // Seed notifications (Genshin Impact update news)
  const notifications = [
    {
      title: "Version 5.5 'Chrysos, Burden of Ages' Update Now Live!",
      content:
        "Travelers, version 5.5 is now available! Explore the new Chrysos region, unlock new story quests, and discover rare weapons. Citlali joins as a 5-star Cryo character. Update now to begin your journey.",
      type: "update",
      publishedAt: new Date("2026-03-02T06:00:00Z"),
    },
    {
      title: "New Limited Character: Citlali — Cryo Constellation",
      content:
        "The 5-star Cryo character Citlali is now available on the Character Event Wish. Her unique Nightsoul mechanics and powerful off-field support make her a valuable addition to any team. Banner runs until March 18.",
      type: "event",
      publishedAt: new Date("2026-03-02T04:00:00Z"),
    },
    {
      title: "Scheduled Maintenance — March 2, 06:00–11:00 UTC+8",
      content:
        "Genshin Impact will undergo scheduled maintenance on March 2 from 06:00 to 11:00 (UTC+8) for the v5.5 update. During this time the game will be unavailable. All Travelers will receive 60 Primogems as compensation.",
      type: "maintenance",
      publishedAt: new Date("2026-03-01T14:00:00Z"),
    },
    {
      title: "Event Quest 'Winternight Rhapsody' Ends Soon",
      content:
        "The limited-time event quest 'Winternight Rhapsody' concludes on March 3. Complete the final chapter to earn the exclusive Namecard and 420 Primogems before the event ends. Don't miss out!",
      type: "event",
      publishedAt: new Date("2026-03-01T08:00:00Z"),
    },
    {
      title: "Lantern Rite Festival Rewards — Final Week",
      content:
        "The Lantern Rite Festival enters its final week! Collect Xiao Lanterns from the Harbor and exchange them for exclusive rewards including Primogems, Character EXP materials, and the limited Lantern Rite namecard.",
      type: "event",
      publishedAt: new Date("2026-02-20T09:00:00Z"),
    },
    {
      title:
        "Version 5.4 'Vibrant Harriers Aloft in Spring Breeze' Is Now Live",
      content:
        "The Lantern Rite returns to Liyue! Version 5.4 brings the annual Lantern Rite festival, new story quests for Keqing and Shenhe, three new event weapons, and major performance improvements across all platforms.",
      type: "update",
      publishedAt: new Date("2026-02-11T08:00:00Z"),
    },
    {
      title: "New Limited Weapon: Crane's Echoing Call Now Available",
      content:
        "The 5-star Polearm 'Crane's Echoing Call' is now featured on the Epitome Invocation weapon banner. This elegant weapon dramatically boosts Nightsoul-based characters. Wish before the banner closes on Feb 25.",
      type: "event",
      publishedAt: new Date("2026-02-11T06:30:00Z"),
    },
    {
      title: "Shenhe & Yun Jin Rerun — Character Event Wish II",
      content:
        "The beloved Cryo support Shenhe and Geo performer Yun Jin are returning on the Character Event Wish II banner. Both characters synergize perfectly with the new Lantern Rite event lineup. Seize this limited opportunity!",
      type: "event",
      publishedAt: new Date("2026-02-11T06:00:00Z"),
    },
    {
      title: "21 New Achievements Added — 'Tales of the Dragon Isles'",
      content:
        "21 new achievements have been added covering exploration, combat, and story milestones in the Dragon Isles region. Each achievement rewards Primogems and Mora. Check the Achievement menu to see your progress.",
      type: "update",
      publishedAt: new Date("2026-02-05T10:00:00Z"),
    },
    {
      title: "Version 5.3 Special Program Livestream Recap",
      content:
        "Missed the Special Program? Here's what's coming: Version 5.3 'Flowers Resplendent on the Sun-Scorched Sojourn' introduces Iansan (5-star Electro) and Varesa (5-star Anemo), plus a new explorable area deep within Natlan.",
      type: "update",
      publishedAt: new Date("2026-01-28T15:00:00Z"),
    },
    {
      title: "Spiral Abyss Reset — New Blessing of the Abyssal Moon",
      content:
        "The Spiral Abyss has been refreshed with new enemy lineups and a new Blessing: 'Blazing Chamber — When characters use an Elemental Burst, all party members deal +35% DMG for 5s.' Earn up to 600 Primogems this cycle.",
      type: "event",
      publishedAt: new Date("2026-01-15T04:00:00Z"),
    },
  ];

  await prisma.msNotification.deleteMany({});
  await prisma.msNotification.createMany({
    data: notifications.map((n) => ({
      Title: n.title,
      Content: n.content,
      Type: n.type,
      PublishedAt: n.publishedAt,
      Stsrc: "A",
      CreatedAt: new Date(),
      CreatedBy: "system",
    })),
  });
  console.log(`✅ ${notifications.length} notifications seeded`);

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
