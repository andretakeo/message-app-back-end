import { signToken, verifyToken } from "../utils/token.util.js";

export const generateToken = async (payload, expiresIn, secret) => {
  let token = await signToken(payload, expiresIn, secret);
  return token;
};

export const validateToken = async (token, secret) => {
  let decoded = await verifyToken(token, secret);
  return decoded;
};
