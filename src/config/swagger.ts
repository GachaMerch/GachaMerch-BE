import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "GachaMerch API",
      version: "1.0.0",
      description: "API documentation for GachaMerch Backend",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development server",
      },
    ],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            UserId: { type: "integer", example: 1 },
            Username: { type: "string", example: "john_doe" },
            Email: { type: "string", example: "john@example.com" },
            CoinBalance: { type: "number", example: 5000 },
            Role: { type: "string", example: "user" },
            CreatedAt: { type: "string", format: "date-time" },
          },
        },
        AuthResponse: {
          type: "object",
          properties: {
            token: { type: "string", example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." },
            user: { $ref: "#/components/schemas/User" },
          },
        },
        ShopItem: {
          type: "object",
          properties: {
            limitedItems: {
              type: "array",
              items: { $ref: "#/components/schemas/Weapon" },
            },
            legendary: {
              type: "array",
              items: { $ref: "#/components/schemas/Weapon" },
            },
          },
        },
        Notification: {
          type: "object",
          properties: {
            NotifId: { type: "integer", example: 1 },
            Title: { type: "string", example: "New Weapon Available!" },
            Content: { type: "string", example: "Aquila Favonia is now in the shop." },
            Type: { type: "string", example: "info" },
            PublishedAt: { type: "string", format: "date-time" },
          },
        },
        InventoryItem: {
          type: "object",
          properties: {
            InventoryId: { type: "integer", example: 1 },
            UserId: { type: "integer", example: 1 },
            WeaponId: { type: "integer", example: 5 },
            Quantity: { type: "integer", example: 2 },
            weapon: { $ref: "#/components/schemas/Weapon" },
          },
        },
        Weapon: {
          type: "object",
          properties: {
            WeaponId: { type: "integer", example: 1 },
            Title: { type: "string", example: "Aquila Favonia" },
            Type: { type: "string", example: "Sword" },
            Image: { type: "string", example: "https://example.com/image.png" },
            Rarity: { type: "integer", example: 5 },
            BaseAtk: { type: "number", example: 48.0 },
            SubStat: { type: "string", example: "Physical DMG Bonus" },
            PassiveName: { type: "string", example: "Falcon's Defiance" },
            PassiveDesc: {
              type: "string",
              example: "ATK is increased by 20%...",
            },
            Location: { type: "string", example: "Gacha" },
            AscensioMaterial: { type: "string", example: "Decarabian" },
            Price: { type: "number", example: 100000 },
            DiscountAmount: { type: "number", example: 0 },
            Stsrc: { type: "string", example: "A" },
            CreatedAt: { type: "string", format: "date-time" },
            CreatedBy: { type: "string" },
            UpdatedAt: { type: "string", format: "date-time" },
            UpdatedBy: { type: "string" },
          },
        },
        Pagination: {
          type: "object",
          properties: {
            page: { type: "integer", example: 1 },
            limit: { type: "integer", example: 10 },
            total: { type: "integer", example: 50 },
            totalPages: { type: "integer", example: 5 },
          },
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: true },
            message: { type: "string", example: "Success" },
            data: { type: "array", items: {} },
            pagination: { $ref: "#/components/schemas/Pagination" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Error" },
            errors: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
  },
  apis: ["./src/modules/**/*.route.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
