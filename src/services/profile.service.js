import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import { userModel } from "../models/index.js";
import {
  validateEmailUpdate,
  validateNameUpdate,
  validatePasswordUpdate,
  validatePictureUpdate,
  validateStatusUpdate,
} from "../utils/profileUpdate.util.js";

const findUserById = async (userId) => {
  try {
    const user = await userModel.findById(userId);

    return user;
  } catch (error) {
    throw new createHttpError.BadRequest("Failed to find user.");
  }
};

export const updateUserProfile = async (
  userId,
  payload,
  DEFAULT_PICTURE,
  DEFAULT_STATUS
) => {
  try {
    const { name, email, picture, status, password } = payload;

    let foundUser = await findUserById(userId);

    const userUpdate = {
      name: validateNameUpdate(foundUser.name, name),
      email: validateEmailUpdate(foundUser.email, email),
      picture: validatePictureUpdate(
        foundUser.picture,
        picture,
        DEFAULT_PICTURE
      ),
      status: validateStatusUpdate(foundUser.status, status, DEFAULT_STATUS),
      password: await validatePasswordUpdate(foundUser.password, password),
    };

    const updatedUser = await userModel.findByIdAndUpdate(userId, userUpdate, {
      new: true,
    });

    return {
      name: updatedUser.name,
      email: updatedUser.email,
      picture: updatedUser.picture,
      status: updatedUser.status,
    };
  } catch (error) {
    throw new createHttpError.BadRequest("Failed to update user.");
  }
};
