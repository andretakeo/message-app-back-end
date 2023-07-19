import createHttpError from "http-errors";
import { userModel } from "../models/index.js";

export const findUser = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) throw createHttpError.BadRequest("Please fill all fields.");
  return user;
};

export const searchUsersByIds = async (userIds) => {
  try {
    const users = await userModel.find({ _id: { $in: userIds } });
    return users;
  } catch (error) {
    throw createHttpError.BadRequest("Oops... Something went wrong!");
  }
};

export const searchUsers = async (keyword, userId) => {
  const users = await userModel
    .find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    })
    .find({
      _id: { $ne: userId },
    })
    .limit(20);
  return users;
};
