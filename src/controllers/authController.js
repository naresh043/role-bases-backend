const jwt = require("jsonwebtoken"); 
const authService = require("../services/authService");
const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/response");

/* ===================== SIGNUP ===================== */
const signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
      return errorResponse({
        res,
        message: "Name, email, and password are required",
        statusCode: 400,
        code: "VALIDATION_ERROR",
      });
    }

    if (password.length < 6) {
      return errorResponse({
        res,
        message: "Password must be at least 6 characters",
        statusCode: 400,
        code: "VALIDATION_ERROR",
      });
    }

    const data = await authService.signupUser({
      name,
      email,
      password,
      role,
    });

    return successResponse({
      res,
      message: "Signup successful",
      data,
      statusCode: 201,
    });
  } catch (error) {
    return errorResponse({
      res,
      message: "Signup failed",
      statusCode: 400,
      code: "VALIDATION_ERROR",
    });
  }
};

/* ===================== LOGIN ===================== */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return errorResponse({
        res,
        message: "Email and password are required",
        statusCode: 400,
        code: "VALIDATION_ERROR",
      });
    }

    const data = await authService.loginUser(email, password);

    return successResponse({
      res,
      message: "Login successful",
      data,
    });
  } catch (error) {
    return errorResponse({
      res,
      message: "Invalid email or password",
      statusCode: 401,
      code: "UNAUTHORIZED",
    });
  }
};

/* ===================== GET ME ===================== */
const getMe = async (req, res) => {
  return successResponse({
    res,
    message: "User profile fetched successfully",
    data: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
      lastLogin: req.user.lastLogin,
    },
  });
};

/* ===================== LOGOUT ===================== */
const logout = async (req, res) => {
  // Stateless JWT logout — client removes tokens
  return successResponse({
    res,
    message: "Logged out successfully",
  });
};

/* ===================== REFRESH TOKEN ===================== */
const refreshToken = async (req, res) => {
  try {
    const { userId, role } = req.user;

    if (!userId) {
      return errorResponse({
        res,
        message: "Invalid refresh token",
        statusCode: 401,
        code: "UNAUTHORIZED",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return errorResponse({
        res,
        message: "User not found",
        statusCode: 401,
        code: "UNAUTHORIZED",
      });
    }

    // ✅ Generate NEW access token
    const newAccessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "1h" }
    );

    return successResponse({
      res,
      message: "Access token refreshed successfully",
      data: {
        accessToken: newAccessToken,
        expiresIn: 3600,
      },
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    return errorResponse({
      res,
      message: "Failed to refresh token",
      statusCode: 500,
      code: "SERVER_ERROR",
    });
  }
};

module.exports = {
  signup,
  login,
  getMe,
  logout,
  refreshToken,
};
