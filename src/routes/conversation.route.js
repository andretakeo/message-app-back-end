import express from "express";
import trimRequest from "trim-request";
import authMiddleware from "../middlewares/authMiddleware.js";
import {
  create_group_conversation,
  create_open_conversation,
  delete_conversation,
  get_user_conversation,
  update_conversation_name,
} from "../controllers/conversation.controller.js";
const router = express.Router();

// CREATE CONVERSATION
router
  .route("/")
  .post(trimRequest.all, authMiddleware, create_open_conversation);

router
  .route("/group")
  .post(trimRequest.all, authMiddleware, create_group_conversation);

// UPDATE CONVERSATION
router
  .route("/update/name/:convoId")
  .put(trimRequest.all, authMiddleware, update_conversation_name);

// GET CONVERSATION

router.route("/").get(trimRequest.all, authMiddleware, get_user_conversation);

// DELETE CONVERSATION
router
  .route("/delete/:convoId")
  .delete(trimRequest.all, authMiddleware, delete_conversation);

export default router;
