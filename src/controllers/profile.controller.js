import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

import { logger } from "../configs/logger.config.js";
import {
  updateUserProfile,
  deleteUserProfile,
  changeEmail,
  changePassword,
} from "../services/profile.service.js";
import { getAccessToken } from "../services/token.service.js";

export const updateUser = async (req, res, next) => {
  try {
    const { userId } = await getAccessToken(req.headers["authorization"]);

    const { user } = req.body;

    const updatedUser = await updateUserProfile(
      userId,
      user,
      process.env.DEFAULT_PICTURE,
      process.env.DEFAULT_STATUS
    );

    res.json(updatedUser);
  } catch (error) {
    logger.error(error);
    next(
      error instanceof createHttpError.HttpError
        ? error
        : new createHttpError.InternalServerError("Failed to update user.")
    );
  }
};

export const updateEmail = async (req, res, next) => {
  try {
    const { userId } = await getAccessToken(req.headers["authorization"]);
    const { newEmail } = req.body;

    const updatedUser = await changeEmail(userId, { newEmail });

    res.json(updatedUser);
  } catch (error) {
    logger.error(error);
    next(
      error instanceof createHttpError.HttpError
        ? error
        : new createHttpError.InternalServerError("Failed to update email.")
    );
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { userId } = await getAccessToken(req.headers["authorization"]);
    const { oldPassword, newPassword } = req.body;

    const updatedUser = await changePassword(userId, {
      oldPassword,
      newPassword,
    });

    res.json(updatedUser);
  } catch (error) {
    logger.error(error);
    next(
      error instanceof createHttpError.HttpError
        ? error
        : new createHttpError.InternalServerError("Failed to update password.")
    );
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { userId } = await getAccessToken(req.headers["authorization"]);
    const { email, password } = req.body;

    const deletedUser = await deleteUserProfile(userId, email, password);

    res.json(deletedUser);
  } catch (error) {
    logger.error(error);
    next(
      error instanceof createHttpError.HttpError
        ? error
        : new createHttpError.InternalServerError("Failed to delete user.")
    );
  }
};
