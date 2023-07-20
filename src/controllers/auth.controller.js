import createHttpError from "http-errors";
import { createUser, signUser } from "../services/auth.service.js";
import {
  generateToken,
  validateToken,
  revokeToken,
  isTokenRevoked,
} from "../services/token.service.js";

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

    const accessToken = await generateToken(
      { userId: newUser._id },
      "10d",
      process.env.ACCESS_TOKEN_SECRET
    );

    const refreshToken = await generateToken(
      { userId: newUser._id },
      "30d",
      process.env.REFRESH_TOKEN_SECRET
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      path: "/api/v1/auth/",
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
      accessToken: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password, remember } = req.body;

    // will take care of validation and creating user
    const user = await signUser(email, password);

    const accessToken = await generateToken(
      { userId: user._id },
      "10d",
      process.env.ACCESS_TOKEN_SECRET
    );

    // Adding a remember me feature
    if (remember === true) {
      const refreshToken = await generateToken(
        { userId: user._id },
        "30d",
        process.env.REFRESH_TOKEN_SECRET
      );

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/api/v1/auth/",
        maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
      });
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        status: user.status,
        picture: user.picture,
      },
      accesstoken: accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshtoken;
    if (!refreshToken) {
      throw createHttpError.Unauthorized("Please, login first.");
    }

    const isRevoked = await isTokenRevoked(refreshToken);
    if (isRevoked) {
      throw createHttpError.Unauthorized("Please, login first.");
    }

    const check = await validateToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const payload = {
      userId: check.userId,
      token: refreshToken,
      exp: check.exp,
    };

    await revokeToken({
      userId: check.userId,
      token: refreshToken,
      expiresAt: new Date(check.exp * 1000),
    });

    await res.clearCookie("refreshtoken", {
      path: "/api/v1/auth/",
    });

    res.json({ message: "logout successful!" });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshtoken;
    console.log(refreshToken);

    if (!refreshToken) {
      throw createHttpError.Unauthorized("Please, login first.");
    }

    // check if the refresh token is revoked
    const isRevoked = await isTokenRevoked(refreshToken);
    if (isRevoked) {
      throw createHttpError.Unauthorized("Please, login first.");
    }

    const check = await validateToken(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const access_token = await generateToken(
      { userId: check.userId },
      "10d",
      process.env.ACCESS_TOKEN_SECRET
    );

    res.json({ accessToken: access_token });
  } catch (error) {
    next(error);
  }
};
