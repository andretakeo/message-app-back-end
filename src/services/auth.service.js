import createHttpError from "http-errors";
import bcrypt from "bcrypt";

import { userModel } from "../models/index.js";
import {
  validateName,
  validateEmail,
  validatePicture,
  validateStatus,
  validatePassword,
} from "../utils/credentials.util.js";

const { DEFAULT_PICTURE, DEFAULT_STATUS } = process.env;

export const createUser = async (user) => {
  const { name, email, status, picture, password } = user;

  // check if dields are not empty
  if (!name || !email || !password) {
    throw createHttpError.BadRequest("Please fill all fields.");
  }

  validateName(name);

  validateEmail(email);

  validatePassword(password);

  //   check if user already exists
  const userExists = await userModel.findOne({ email });

  if (userExists) {
    throw createHttpError.Conflict("User already exists.");
  }

  //   create user
  const newUser = await new userModel({
    name,
    email,
    status: validateStatus(status, DEFAULT_STATUS) || DEFAULT_STATUS,
    picture: validatePicture(picture, DEFAULT_PICTURE) || DEFAULT_PICTURE,
    password,
  }).save();

  return newUser;
};

export const signUser = async (email, password) => {
  validateEmail(email);
  validatePassword(password);

  //   check if user already exists

  const foundUser = await userModel.findOne({ email });

  if (!foundUser) {
    throw createHttpError.NotFound("Invalid Credentials.");
  }

  //   compare passwords
  let isPasswordValid = await bcrypt.compare(password, foundUser.password);

  if (!isPasswordValid) {
    throw createHttpError.Unauthorized("Invalid Credentials.");
  }

  return foundUser;
};
