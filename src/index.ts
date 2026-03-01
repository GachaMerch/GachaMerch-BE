import "dotenv/config";
import express, { Request, Response } from "express";
import path from "path";
import weaponRoute from "@/routes/weapon.route";

const app = express();

app.use(express.json());
app.use("/assets", express.static(path.join(__dirname, "../../assets")));
const PORT = process.env.PORT || 3000;

// Swagger docs (development only)
if (process.env.NODE_ENV !== "production") {
  import("swagger-ui-express").then((swaggerUi) => {
    import("@/config/swagger").then(({ swaggerSpec }) => {
      app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    });
  });
}

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ name: "GACHAMERCH", status: "Alive" });
});

app.use("/api/weapons", weaponRoute);

const startServer = async (): Promise<void> => {
  try {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      if (process.env.NODE_ENV !== "production") {
        console.log(`API Docs: http://localhost:${PORT}/api-docs`);
      }
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export default app;
