import z from "zod";
import { ExpressHandler } from ".";
import { loginSchema, registerSchema } from "../utils/zodSchema";
import { ClientError } from "../errors/errors";
import { User } from "../models/userModel";
import { StatusCodes } from "http-status-codes";
import { getPasswordHash, isPasswordMatch } from "../utils/password";
import {
  getAccessToken,
  getRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from "../utils/token";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { Types } from "mongoose";

interface RegisterRequestBody {
  username: string;
  email: string;
  password: string;
}

interface LoginRequestBody {
  email: string;
  password: string;
}

const register: ExpressHandler = async (req, res, next) => {
  // Extract user input from request body
  const { username, email, password }: RegisterRequestBody = req.body || {};

  // Validate input using Zod schema
  const result = registerSchema.safeParse({ username, email, password });

  if (!result.success) {
    // Format validation errors and pass to error handler
    const message = z.prettifyError(result.error);
    next(new ClientError(message));
    return;
  }

  // Destructure validated and sanitized data
  const {
    username: cleanUsername,
    email: cleanEmail,
    password: cleanPassword,
  } = result.data;

  try {
    // Check if user already exists by email
    const existingUser = await User.exists({ email: cleanEmail });
    if (existingUser) {
      // Send friendly conflict error if user already exists
      next(
        new ClientError(
          "Looks like you've already registered. Try logging in instead?",
          StatusCodes.CONFLICT
        )
      );
      return;
    }

    // Hash password before storing
    const passwordHash = await getPasswordHash(cleanPassword);

    // Create new user in the database
    const newUser = await User.create({
      username: cleanUsername,
      email: cleanEmail,
      passwordHash,
    });

    // Respond with success and new user info
    res.status(StatusCodes.CREATED).json({
      message: "Welcome aboard! Your account has been created.",
      newUser,
    });
  } catch (e) {
    // Handle unexpected server errors
    next(e);
  }
};

const login: ExpressHandler = async (req, res, next) => {
  // Pull credentials from request body, fallback to empty object
  const { email, password }: LoginRequestBody = req.body || {};

  // Validate structure and format of credentials
  const result = loginSchema.safeParse({ email, password });

  if (!result.success) {
    // If validation fails, format error message and delegate to error handler
    const message = z.prettifyError(result.error);
    next(new ClientError(message));
    return;
  }

  // Extract sanitized inputs after validation
  const { email: cleanEmail, password: cleanPassword } = result.data;

  try {
    // Attempt to locate user by email
    const existingUser = await User.findOne({ email: cleanEmail }).lean();

    if (!existingUser) {
      // If user doesn’t exist, reject login with a generic auth error
      next(new ClientError("Invalid Credentials", StatusCodes.UNAUTHORIZED));
      return;
    }

    // Compare provided password with stored hash
    const isMatch = await isPasswordMatch(
      cleanPassword,
      existingUser.passwordHash
    );

    if (!isMatch) {
      // If password doesn’t match, reject login
      next(new ClientError("Invalid Credentials", StatusCodes.UNAUTHORIZED));
      return;
    }

    // Generate access and refresh tokens for session
    const accessToken = getAccessToken(existingUser._id);
    const refreshToken = getRefreshToken(existingUser._id);

    // Attach tokens to secure, HTTP-only cookies
    res.cookie("accessToken", accessToken, { httpOnly: true });
    res.cookie("refreshToken", refreshToken, { httpOnly: true });

    // Respond with login success
    res.status(StatusCodes.CREATED).json({
      message: "Login successful",
    });
  } catch (e) {
    // Pass unexpected errors to global error handler
    next(e);
  }
};

const verify: ExpressHandler = async (req, res, next) => {
  // Retrieve tokens from cookies
  const accessToken = req.cookies.accessToken as string | undefined;
  const refreshToken = req.cookies.refreshToken as string | undefined;

  // Skip verification if already authenticated upstream
  if (req.userId) {
    next();
    return;
  }

  // Deny access if either token is missing
  if (!accessToken || !refreshToken) {
    next(new ClientError("Invalid credentials", StatusCodes.UNAUTHORIZED));
    return;
  }

  try {
    // Verify access token
    const decodedAccessToken = verifyAccessToken(accessToken);
    req.userId = new Types.ObjectId(decodedAccessToken.userId);
    next();
  } catch (e) {
    // If access token is expired, try verifying refresh token
    if (e instanceof TokenExpiredError) {
      try {
        const decodedRefreshToken = verifyRefreshToken(refreshToken);
        req.userId = new Types.ObjectId(decodedRefreshToken.userId);

        // Issue new access token and continue
        const newAccessToken = getAccessToken(req.userId);
        res.cookie("accessToken", newAccessToken, { httpOnly: true });
        next();
        return;
      } catch (e) {
        // Refresh token invalid or expired
        next(
          new ClientError(
            "Session Expired. Please Login.",
            StatusCodes.UNAUTHORIZED
          )
        );
        return;
      }
    }

    // Reject malformed or tampered tokens
    if (e instanceof JsonWebTokenError) {
      next(new ClientError("Invalid credentials", StatusCodes.UNAUTHORIZED));
      return;
    }

    // Handle any unexpected errors
    next(e);
  }
};

const getUser: ExpressHandler = async (req, res, next) => {
  const userId = req.userId;

  try {
    // Fetch user by ID and respond with details
    const user = await User.findById(userId);
    res.status(StatusCodes.OK).json({
      user,
    });
  } catch (e) {
    // Forward any database errors
    next(e);
  }
};

const logout: ExpressHandler = async (req, res, next) => {
  // Clear authentication cookies and confirm logout
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.status(StatusCodes.OK).json({
    message: "Logout successful",
  });
};

export const authController = { register, login, verify, getUser, logout };
