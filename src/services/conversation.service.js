import createHttpError from "http-errors";
import { conversationModel, userModel } from "../models/index.js";
import {
  validateConversationName,
  validateConversationUsers,
  validateConversationAdmin,
  validateConversationIsGroup,
} from "../utils/conversation.util.js";

// // this is what should go to the database

// {
//     name: "Example Conversation",
//     isGroup: false,
//     users: [
//       ObjectId("user1Id"),
//       ObjectId("user2Id"),
//       ObjectId("user3Id")
//     ],
//     latestMessage: ObjectId("messageId"),
//     admin: ObjectId("adminUserId")
//   }

export const doesConversationExist = async (sender_id, receiver_id) => {
  const convos = await conversationModel
    .find({
      isGroup: false,
      users: { $all: [sender_id, receiver_id] },
    })
    .populate("users", "-password")
    .populate("latestMessage")
    .populate("latestMessage.sender", "name email picture status");

  console.log(convos);

  if (convos.length === 0) {
    return false;
  }

  return convos[0];
};

export const createConversation = async (data) => {
  const { name, isGroup, users, admin } = data;

  validateConversationName(name);
  validateConversationUsers(users);
  validateConversationAdmin(admin);
  validateConversationIsGroup(isGroup, users);

  const newConvo = await conversationModel.create({
    name,
    isGroup,
    users,
    admin,
  });
  if (!newConvo)
    throw createHttpError.BadRequest("Oops... Something went wrong!");

  return newConvo;
};

export const populateConversation = async (
  id,
  fieldToPopulate,
  fieldsToRemove
) => {
  const populatedConvo = await conversationModel
    .findOne({ _id: id })
    .populate(fieldToPopulate, fieldsToRemove)
    .populate("latestMessage.sender", "name email picture status");

  if (!populatedConvo)
    throw createHttpError.BadRequest("Oops... Something went wrong!");

  return populatedConvo;
};

export const findUserConversations = async (userId) => {
  try {
    const conversations = await conversationModel.find({ users: userId });

    return conversations;
  } catch (err) {
    throw createHttpError.BadRequest("Unable to find conversations!");
  }
};

export const addUsersToConversation = async (conversationId, userIds) => {
  try {
    const updatedConversation = await conversationModel.findByIdAndUpdate(
      conversationId,
      {
        $push: { users: { $each: userIds } },
      },
      { new: true }
    );
    return updatedConversation;
  } catch (error) {
    throw createHttpError.BadRequest("Oops... Something went wrong!");
  }
};
