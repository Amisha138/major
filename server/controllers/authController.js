const asyncHandler = require("express-async-handler");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const getJwtSecret = () => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return process.env.JWT_SECRET;
};

const getCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: COOKIE_MAX_AGE,
});

const generateToken = (userId) =>
  jwt.sign({ userId }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const sanitizeUser = (user) => {
  const safeUser = user.toObject();
  delete safeUser.password;
  return safeUser;
};

const registerUser = asyncHandler(async (req, res) => {
  const name = req.body.name?.trim();
  const email = req.body.email?.trim().toLowerCase();
  const mobile = req.body.mobile?.trim();
  const password = req.body.password;

  if (!name || !email || !mobile || !password) {
    res.status(400);
    throw new Error("Name, email, mobile, and password are required");
  }

  if (password.length < 6) {
    res.status(400);
    throw new Error("Password must be at least 6 characters");
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { mobile }],
  });

  if (existingUser) {
    res.status(400);
    throw new Error(
      existingUser.email === email
        ? "A user with this email already exists"
        : "A user with this mobile number already exists",
    );
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const user = await User.create({
    name,
    email,
    mobile,
    password: hashedPassword,
  });

  const token = generateToken(user._id);

  res.cookie(COOKIE_NAME, token, getCookieOptions());
  res.status(201).json({
    success: true,
    data: {
      user: sanitizeUser(user),
    },
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const email = req.body.email?.trim().toLowerCase();
  const mobile = req.body.mobile?.trim();
  const identifier = req.body.identifier?.trim();
  const password = req.body.password;

  if ((!email && !mobile && !identifier) || !password) {
    res.status(400);
    throw new Error("Email or mobile and password are required");
  }

  let query = null;

  if (email) {
    query = { email };
  } else if (mobile) {
    query = { mobile };
  } else if (identifier.includes("@")) {
    query = { email: identifier.toLowerCase() };
  } else {
    query = { mobile: identifier };
  }

  const user = await User.findOne(query);

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.password);

  if (!isPasswordMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = generateToken(user._id);

  res.cookie(COOKIE_NAME, token, getCookieOptions());
  res.status(200).json({
    success: true,
    data: {
      user: sanitizeUser(user),
    },
  });
});

const logoutUser = asyncHandler(async (_req, res) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({
    success: true,
    data: {
      message: "Logged out successfully",
    },
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
    },
  });
});

module.exports = {
  getCurrentUser,
  loginUser,
  logoutUser,
  registerUser,
};
