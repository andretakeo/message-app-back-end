import createHttpError from "http-errors";
import { conversationModel, userModel } from "../models/index.js";
import { update_conversation_name } from "../controllers/conversation.controller.js";

export const findConversationById = async (id) => {
  try {
    const foundConvo = await conversationModel.findOne({ _id: id });
    return foundConvo;
  } catch (error) {
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  }
};

export const doesConversationExist = async (sender_id, receiver_id) => {
  let convos = await conversationModel
    .find({
      isGroup: false,
      $and: [
        { users: { $elemMatch: { $eq: sender_id } } },
        { users: { $elemMatch: { $eq: receiver_id } } },
      ],
    })
    .populate("users", "-password")
    .populate("latestMessage");

  if (!convos)
    throw createHttpError.BadRequest("Oops...Something went wrong !");

  //populate message model
  convos = await userModel.populate(convos, {
    path: "latestMessage.sender",
    select: "name email picture status",
  });

  return convos[0];
};

export const createConversation = async (data) => {
  const newConvo = await conversationModel.create(data);
  if (!newConvo)
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  return newConvo;
};

export const populateConversation = async (
  id,
  fieldToPopulate,
  fieldsToRemove
) => {
  const populatedConvo = await conversationModel
    .findOne({ _id: id })
    .populate(fieldToPopulate, fieldsToRemove);
  if (!populatedConvo)
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  return populatedConvo;
};

export const getUserConversations = async (userId) => {
  const convos = await conversationModel
    .find({ users: { $elemMatch: { $eq: userId } } })
    .populate("users admin", "-password")
    .populate("latestMessage");
  if (!convos)
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  return convos;
};

export const updateConversation = async (convoId, data) => {
  const updatedConvo = await conversationModel.findOneAndUpdate(
    { _id: convoId },
    data,
    { new: true }
  );
  if (!updatedConvo)
    throw createHttpError.BadRequest("Oops...Something went wrong !");
  return updatedConvo;
};

export const deleteConversation = async (convoId) => {
  if (!convoId) {
    throw createHttpError.BadRequest("Please provide a conversation id !");
  }
  const deletedConvo = await conversationModel.findOneAndDelete({
    _id: convoId,
  });

  if (!deletedConvo)
    throw createHttpError.BadRequest("Oops...Something went wrong !");
};
