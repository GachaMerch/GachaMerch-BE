import { Router } from "express";
import { getShopHandler } from "@/controllers/shop.controller";

const router = Router();

router.get("/", getShopHandler);

export default router;
