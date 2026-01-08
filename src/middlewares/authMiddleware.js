const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { errorResponse } = require("../utils/response");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return errorResponse({
        res,
        message: "Authentication required",
        statusCode: 401,
        code: "UNAUTHORIZED",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return errorResponse({
        res,
        message: "User not found or inactive",
        statusCode: 401,
        code: "UNAUTHORIZED",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return errorResponse({
      res,
      message: "Invalid or expired token",
      statusCode: 401,
      code: "UNAUTHORIZED",
    });
  }
};

module.exports = authMiddleware;
