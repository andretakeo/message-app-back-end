import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

import { logger } from "../configs/logger.config.js";
import { updateUserProfile } from "../services/profile.service.js";
import { validateToken } from "../services/token.service.js";

export const updateUser = async (req, res, next) => {
  try {
    // Pick the userId from the access cookie and the user from the request body.
    // So that the user can only update his own profile.

    const bearerToken = req.headers["authorization"];
    const token = bearerToken.split(" ")[1];
    const check = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const isExpired = Date.now() >= check.exp * 1000;

    if (isExpired) {
      throw new createHttpError.Unauthorized("Access token expired.");
    }

    const { userId } = check;

    console.log(userId);

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
    next(createHttpError.BadRequest("Failed to update user."));
  }
};
