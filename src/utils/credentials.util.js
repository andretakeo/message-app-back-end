import validator from "validator";
import createHttpError from "http-errors";

export const validateName = (name) => {
  if (!validator.isLength(name, { min: 4, max: 60 })) {
    throw createHttpError.BadRequest(
      "Name should be at least 4 characters and not more than 60 characters."
    );
  }
};

export const validateEmail = (email) => {
  if (!validator.isEmail(email)) {
    throw createHttpError.BadRequest("Please enter a valid email.");
  }
};

export const validateStatus = (status) => {
  if (!validator.isLength(status, { min: 4, max: 60 })) {
    throw createHttpError.BadRequest(
      "Status should be at least 4 characters and not more than 60 characters."
    );
  }
};

export const validatePicture = (picture, default_picture) => {
  if (!validator.isURL(picture)) {
    return default_picture;
  }

  return picture;
};

export const validatePassword = (password) => {
  if (!validator.isLength(password, { min: 4, max: 120 })) {
    throw createHttpError.BadRequest(
      "Password should be at least 4 characters and not more than 120 characters."
    );
  }
};
