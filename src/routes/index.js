import express from "express";
import authRoutes from "./auth.route.js";
import userRoutes from "./user.route.js";
import profileRoutes from "./profile.route.js";
import conversationRoutes from "./conversation.route.js";
const router = express.Router();

router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/profile", profileRoutes);
router.use("/conversation", conversationRoutes);
export default router;
