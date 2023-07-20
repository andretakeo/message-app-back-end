import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  create_open_conversation,
  create_group_conversation,
  get_user_conversations,
} from "../controllers/conversation.controller.js";

const router = express.Router();

router
  .route("/create")
  .post(trimRequest.all, authMiddleware, create_open_conversation);

router
  .route("/create/group")
  .post(trimRequest.all, authMiddleware, create_group_conversation);

router.route("/").get(authMiddleware, get_user_conversations);

export default router;
