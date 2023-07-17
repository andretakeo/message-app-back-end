import bcrypt from "bcrypt";

import {
  validateName,
  validateEmail,
  validatePicture,
  validateStatus,
  validatePassword,
} from "./credentials.util.js";

export function validateNameUpdate(initialState, finalState) {
  if (finalState === null || finalState === "" || finalState === initialState) {
    return initialState;
  }

  validateName(finalState);

  return finalState;
}

export function validateEmailUpdate(initialState, finalState) {
  if (finalState === null || finalState === "" || finalState === initialState) {
    return initialState;
  }

  validateEmail(finalState);

  return finalState;
}

export function validatePictureUpdate(
  initialState,
  finalState,
  defaultPicture
) {
  if (finalState === null || finalState === initialState) {
    return initialState;
  }

  return validatePicture(finalState, defaultPicture);
}

export function validateStatusUpdate(initialState, finalState, defaultStatus) {
  if (finalState === null || finalState === initialState) {
    return initialState;
  }
  return validateStatus(finalState, defaultStatus);
}

export async function validatePasswordUpdate(initialState, finalState) {
  validatePassword(finalState);
  const passwordMatch = await bcrypt.compare(finalState, initialState);

  if (finalState === null || finalState === "" || passwordMatch) {
    return initialState;
  }

  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(finalState, salt);
  return hashedPassword;
}
