import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  updateUser,
  deleteUser,
  updateEmail,
  updatePassword,
} from "../controllers/profile.controller.js";

const router = express.Router();

router.route("/update").put(trimRequest.all, authMiddleware, updateUser);
router.route("/delete").delete(trimRequest.all, authMiddleware, deleteUser);
router.route("/update/email").put(trimRequest.all, authMiddleware, updateEmail);
router
  .route("/update/password")
  .put(trimRequest.all, authMiddleware, updatePassword);

export default router;
