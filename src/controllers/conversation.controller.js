import createHttpError from "http-errors";
import { logger } from "../configs/logger.config.js";

import { findUser, searchUsersByIds } from "../services/user.service.js";
import { getAccessToken } from "../services/token.service.js";

import {
  doesConversationExist,
  createConversation,
  populateConversation,
  findUserConversations,
  addUsersToConversation,
} from "../services/conversation.service.js";

// CREATE CONVERSATIONS

export const create_open_conversation = async (req, res, next) => {
  try {
    const { userId } = await getAccessToken(req.headers["authorization"]);
    const sender_id = userId;
    const { receiver_id } = req.body;
    //check if receiver_id is provided

    if (!receiver_id) {
      logger.error(
        "please provide the user id you wanna start a conversation with !"
      );
      throw createHttpError.BadGateway("Oops...Something went wrong !");
    }

    //check if sender_id is the same as receiver_id
    if (sender_id === receiver_id) {
      logger.error("you can't start a conversation with yourself !");
      throw createHttpError.BadGateway("Oops...Something went wrong !");
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
        admin: [sender_id],
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
    const { userId } = await getAccessToken(req.headers["authorization"]);
    const sender_id = userId;
    const { name, users } = req.body;

    //check if name is provided
    if (!name) {
      logger.error("please provide a name for the group!");
    }

    //check if users is provided
    if (!users) {
      logger.error("please provide the users you wanna add to the group!");
      throw createHttpError.BadGateway("Oops...Something went wrong!");
    }

    if (users.length < 1) {
      logger.error("please provide at least one user to add to the group!");
      throw createHttpError.BadGateway("Oops...Something went wrong!");
    }

    // to remove user duplicates and then turn it back to an array
    let users_set = new Set(users);
    let userIds = [...users_set];
    userIds.push(sender_id);

    const foundUsers = await searchUsersByIds(userIds);
    if (!foundUsers) {
      logger.error("please provide valid users to add to the group!");
      throw createHttpError.BadGateway("Oops...Something went wrong!");
    }

    const newConvo = await createConversation({
      name: name,
      isGroup: true,
      users: userIds,
      admin: [sender_id],
    });

    const populatedConvo = await populateConversation(
      newConvo._id,
      "users",
      "-password"
    );
    res.status(200).json(populatedConvo);
  } catch (error) {
    next(error);
  }
};

// GET CONVERSATIONS

export const get_user_conversations = async (req, res, next) => {
  try {
    const { userId } = await getAccessToken(req.headers["authorization"]);
    const sender_id = userId;
    const convos = await findUserConversations(sender_id);
    res.status(200).json(convos);
  } catch (error) {
    next(error);
  }
};
