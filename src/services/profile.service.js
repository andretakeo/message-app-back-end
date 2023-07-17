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

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      throw new createHttpError.BadRequest("Invalid credendtials.");
    }

    if (email !== foundUser.email) {
      throw new createHttpError.BadRequest("Invalid credentials.");
    }

    const userUpdate = {
      name: validateNameUpdate(foundUser.name, name),
      picture: validatePictureUpdate(
        foundUser.picture,
        picture,
        DEFAULT_PICTURE
      ),
      status: validateStatusUpdate(foundUser.status, status, DEFAULT_STATUS),
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

export const deleteUserProfile = async (userId, email, password) => {
  try {
    const foundUser = await findUserById(userId);

    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      throw new createHttpError.BadRequest("Invalid credendtials.");
    }

    if (email !== foundUser.email) {
      throw new createHttpError.BadRequest("Invalid credentials.");
    }

    const deletedUser = await userModel.findByIdAndDelete(userId);

    return deletedUser;
  } catch (error) {
    throw new createHttpError.BadRequest("Failed to delete user.");
  }
};

export const changePassword = async (userId, payload) => {
  try {
    const { oldPassword, newPassword } = payload;

    const foundUser = await findUserById(userId);

    const isPasswordValid = await bcrypt.compare(
      oldPassword,
      foundUser.password
    );

    if (!isPasswordValid) {
      throw new createHttpError.BadRequest("Invalid credentials.");
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    throw new createHttpError.BadRequest("Failed to change password.");
  }
};

export const changeEmail = async (userId, payload) => {
  const { newEmail, password } = payload;
  const foundUser = await findUserById(userId);

  const isPasswordValid = await bcrypt.compare(password, foundUser.password);

  if (!isPasswordValid) {
    throw new createHttpError.BadRequest("Invalid credentials.");
  }

  const updatedUser = await userModel.findByIdAndUpdate(userId, {
    email: newEmail,
  });

  return updatedUser;
};
