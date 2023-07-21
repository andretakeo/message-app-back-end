import createHttpError from "http-errors";
import { logger } from "../configs/logger.config.js";
import {
  findConversationById,
  createConversation,
  doesConversationExist,
  populateConversation,
  getUserConversations,
  updateConversation,
  deleteConversation,
} from "../services/conversation.service.js";
import { findUser, searchUsersByIds } from "../services/user.service.js";
import { getAccessToken } from "../services/token.service.js";

export const create_open_conversation = async (req, res, next) => {
  try {
    const { userId } = await getAccessToken(req.headers.authorization);
    const sender_id = userId;
    const { receiver_id } = req.body;
    //check if receiver_id is provided
    if (!receiver_id) {
      logger.error(
        "please provide the user id you wanna start a conversation with!"
      );
      throw createHttpError.BadGateway("Oops...Something went wrong!");
    }
    //check if chat exists
    const existed_conversation = await doesConversationExist(
      sender_id,
      receiver_id
    );
    if (existed_conversation) {
      res.json(existed_conversation);
    } else {
      let receiver_user = await findUser(receiver_id);
      let convoData = {
        name: receiver_user.name,
        isGroup: false,
        users: [sender_id, receiver_id],
      };
      const newConvo = await createConversation(convoData);
      const populatedConvo = await populateConversation(
        newConvo._id,
        "users",
        "-password"
      );
      res.status(200).json(populatedConvo);
    }
  } catch (error) {
    next(error);
  }
};

export const create_group_conversation = async (req, res, next) => {
  try {
    const { userId } = await getAccessToken(req.headers.authorization);
    const sender_id = userId;
    const { name, receiver_id } = req.body;

    //check if receiver_id is provided
    if (!receiver_id) {
      logger.error(
        "please provide the user id you wanna start a conversation with!"
      );
      throw createHttpError.BadGateway("Oops...Something went wrong!");
    }

    let receiver_ids = [].concat(receiver_id);
    receiver_ids.push(sender_id);

    let found_receiver_users = await searchUsersByIds(receiver_ids);

    let receiver_users_ids = found_receiver_users.map((user) => user._id);
    receiver_users_ids = receiver_users_ids.toString().split(",");

    const commonUsers = receiver_id.filter((user) =>
      receiver_users_ids.includes(user)
    );

    commonUsers.push(sender_id);
    console.log(commonUsers);

    let convoData = {
      name: name,
      isGroup: true,
      users: commonUsers,
      admin: [sender_id],
    };

    if (!name || name === "") {
      convoData = {
        name: found_receiver_users[0].name,
        isGroup: true,
        users: commonUsers,
        admin: [sender_id],
      };
    }

    // console.log(convoData);

    const newConvo = await createConversation(convoData);
    const populatedConvo = await populateConversation(
      newConvo._id,
      "users admin",
      "-password"
    );
    res.status(200).json(populatedConvo);
  } catch (error) {
    next(error);
  }
};

export const update_conversation_name = async (req, res, next) => {
  try {
    const { userId } = await getAccessToken(req.headers.authorization);
    const { convoId } = req.params;
    const { name } = req.body;

    const convo = await findConversationById(convoId);

    if (!convo || convo.length === 0) {
      logger.error("Conversation not found!");
      throw createHttpError.NotFound("Conversation not found!");
    }

    if (!convo.isGroup) {
      logger.error("You are cannot update this conversation!");
      throw createHttpError.Unauthorized(
        "You are cannot update this conversation!"
      );
    }

    if (name === "" || !name) {
      logger.error("Please provide a name for the conversation!");
      throw createHttpError.BadRequest(
        "Please provide a name for the conversation!"
      );
    }

    if (name === convo.name) {
      logger.error("Please provide a different name for the conversation!");
      throw createHttpError.BadRequest(
        "Please provide a different name for the conversation!"
      );
    }

    // is userId admin;
    console.log(convo.admin.includes(userId));
    if (!convo.admin.includes(userId)) {
      logger.error(
        "You are not authorized to update or delete this conversation!"
      );
      throw createHttpError.Unauthorized(
        "You are not authorized to update or delete this conversation!"
      );
    }

    const updatedConvo = await updateConversation(convoId, { name: name });

    res.status(200).json({ updatedConvo });
  } catch (error) {
    next(error);
  }
};

export const get_user_conversation = async (req, res, next) => {
  try {
    const { userId } = await getAccessToken(req.headers.authorization);

    const user_convos = await getUserConversations(userId);

    res.status(200).json(user_convos);
  } catch (error) {
    next(error);
  }
};

export const delete_conversation = async (req, res, next) => {
  try {
    const { userId } = await getAccessToken(req.headers.authorization);
    const { convoId } = req.params;

    const convo = await findConversationById(convoId);
    if (!convo || convo.length === 0) {
      logger.error("Conversation not found!");
      throw createHttpError.NotFound("Conversation not found!");
    }

    // is userId admin;
    console.log(convo.admin.includes(userId));
    if (!convo.admin.includes(userId)) {
      logger.error("You are not authorized to update this conversation!");
      throw createHttpError.Unauthorized(
        "You are not authorized to update this conversation!"
      );
    }

    const deletedConvo = await deleteConversation(convoId);

    res.status(200).json({ message: "Conversation deleted successfully!" });
  } catch (error) {
    next(error);
  }
};
