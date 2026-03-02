import { Router } from "express";
import { getNotificationsHandler } from "@/controllers/notification.controller";

const router = Router();

router.get("/", getNotificationsHandler);

export default router;
