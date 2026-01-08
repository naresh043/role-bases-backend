const bcrypt = require("bcryptjs");
const User = require("../models/User");
const { successResponse, errorResponse } = require("../utils/response");


const createUser = async (req, res) => {
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

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse({
        res,
        message: "User already exists",
        statusCode: 400,
        code: "VALIDATION_ERROR",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    return successResponse({
      res,
      message: "User created successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      statusCode: 201,
    });
  } catch (error) {
    return errorResponse({
      res,
      message: error.message,
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const role = req.query.role;
    const search = req.query.search;

    const skip = (page - 1) * limit;

    // 🔍 Build query
    const query = { isActive: true };

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // 📦 Fetch users
    const users = await User.find(query)
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    return successResponse({
      res,
      message: "Users fetched successfully",
      data: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return errorResponse({
      res,
      message: error.message,
    });
  }
};



const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!role) {
      return errorResponse({
        res,
        message: "Role is required",
        statusCode: 400,
        code: "VALIDATION_ERROR",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse({
        res,
        message: "User not found",
        statusCode: 404,
        code: "NOT_FOUND",
      });
    }

    user.role = role;
    await user.save();

    return successResponse({
      res,
      message: "User role updated successfully",
      data: {
        id: user._id,
        role: user.role,
      },
    });
  } catch (error) {
    return errorResponse({
      res,
      message: error.message,
    });
  }
};


const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return errorResponse({
        res,
        message: "User not found",
        statusCode: 404,
        code: "NOT_FOUND",
      });
    }

    user.isActive = false;
    await user.save();

    return successResponse({
      res,
      message: "User deactivated successfully",
    });
  } catch (error) {
    return errorResponse({
      res,
      message: error.message,
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUserRole,
  deleteUser,
};
