import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/authMiddleware.js";
import { updateUser } from "../controllers/profile.controller.js";
const router = express.Router();

router.route("/update").put(trimRequest.all, authMiddleware, updateUser);
export default router;
