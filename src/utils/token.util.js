import jwt from "jsonwebtoken";
import { logger } from "../configs/logger.config.js";

export const signToken = async (payload, expiresIn, secret) => {
  try {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, secret, { expiresIn }, (err, token) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        resolve(token);
      });
    });
  } catch (error) {
    logger.error(error);
  }
};

export const verifyToken = async (token, secret) => {
  try {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          logger.error(err);
          reject(err);
        }
        resolve(decoded);
      });
    });
  } catch (error) {
    logger.error(error);
  }
};
