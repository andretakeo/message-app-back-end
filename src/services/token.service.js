import { signToken, verifyToken } from "../utils/token.util.js";
import RevokedToken from "../models/revokedTokenModel.js";

export const generateToken = async (payload, expiresIn, secret) => {
  const token = await signToken(payload, expiresIn, secret);
  return token;
};

export const validateToken = async (token, secret) => {
  const decoded = await verifyToken(token, secret);
  return decoded;
};

export const revokeToken = async (refreshToken) => {
  const revokedToken = new RevokedToken(refreshToken);
  await revokedToken.save();
};

export const isTokenRevoked = async (token) => {
  const isRevoked = await RevokedToken.exists({ token });
  return isRevoked;
};
