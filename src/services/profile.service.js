import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import owasp from "owasp-password-strength-test";
import { userModel } from "../models/index.js";
import {
  validateEmailUpdate,
  validateNameUpdate,
  validatePasswordUpdate,
  validatePictureUpdate,
  validateStatusUpdate,
} from "../utils/profileUpdate.util.js";

owasp.config({
  allowPassphrases: true,
  maxLength: 128,
  minLength: 10,
  minPhraseLength: 20,
  minOptionalTestsToPass: 4,
});

const findUserById = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new createHttpError.NotFound("User not found.");
    }
    return user;
  } catch (error) {
    throw error instanceof createHttpError.HttpError
      ? error
      : new createHttpError.InternalServerError("Failed to find user.");
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
      throw new createHttpError.Unauthorized("Invalid credentials.");
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
    throw error instanceof createHttpError.HttpError
      ? error
      : new createHttpError.InternalServerError("Failed to update user.");
  }
};

export const deleteUserProfile = async (userId, email, password) => {
  try {
    const foundUser = await findUserById(userId);
    const isPasswordValid = await bcrypt.compare(password, foundUser.password);

    if (!isPasswordValid) {
      throw new createHttpError.Unauthorized("Invalid credentials.");
    }

    if (email !== foundUser.email) {
      throw new createHttpError.BadRequest("Invalid credentials.");
    }

    const deletedUser = await userModel.findByIdAndDelete(userId);
    return deletedUser;
  } catch (error) {
    throw error instanceof createHttpError.HttpError
      ? error
      : new createHttpError.InternalServerError("Failed to delete user.");
  }
};

export const changeEmail = async (userId, payload) => {
  const { newEmail, password } = payload;
  const foundUser = await findUserById(userId);

  const isPasswordValid = await bcrypt.compare(password, foundUser.password);

  if (!isPasswordValid) {
    throw new createHttpError.Unauthorized("Invalid credentials.");
  }

  // TODO: Add a step here to verify the new email address before updating it.

  const updatedUser = await userModel.findByIdAndUpdate(userId, {
    email: newEmail,
  });

  return updatedUser;
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
      throw new createHttpError.Unauthorized("Invalid credentials.");
    }

    const passwordStrengthTest = owasp.test(newPassword);
    if (!passwordStrengthTest.strong) {
      throw new createHttpError.BadRequest("Password is not strong enough.");
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS, 10));
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    const updatedUser = await userModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );

    return updatedUser;
  } catch (error) {
    throw error instanceof createHttpError.HttpError
      ? error
      : new createHttpError.InternalServerError("Failed to change password.");
  }
};
