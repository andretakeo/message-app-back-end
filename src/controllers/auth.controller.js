import createHttpError from "http-errors";
import { createUser, signUser } from "../services/auth.service.js";
import { generateToken, validateToken } from "../services/token.service.js";

const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env;

export const register = async (req, res, next) => {
  try {
    const { name, email, status, picture, password } = req.body;

    // will take care of validation and creating user
    const newUser = await createUser({
      name,
      email,
      status,
      picture,
      password,
    });

    const access_token = await generateToken(
      { userId: newUser._id },
      "15m",
      ACCESS_TOKEN_SECRET
    );

    const refresh_token = await generateToken(
      { userId: newUser._id },
      "15m",
      REFRESH_TOKEN_SECRET
    );

    res.cookie("refreshToken", refresh_token, {
      httpOnly: true,
      path: "/api/v1/auth/refreshToken",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });

    res.json({
      user: {
        _id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        status: newUser.status,
        picture: newUser.picture,
      },
      accessToken: access_token,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {};

export const logout = async (req, res, next) => {};
