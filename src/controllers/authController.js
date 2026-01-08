const authService = require("../services/authService");
const { successResponse, errorResponse } = require("../utils/response");

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
      message: error.message,
      statusCode: 400,
      code: "VALIDATION_ERROR",
    });
  }
};

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
      message: error.message,
      statusCode: 401,
      code: "UNAUTHORIZED",
    });
  }
};

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

const logout = async (req, res) => {
  /**
   * Since JWT is stateless, we don’t destroy anything on the server.
   * The client simply deletes the token.
   */

  return res.status(200).json({
    success: true,
    message: "Logged out successfully"
  });
};

const refreshToken = async (req, res) => {
  const user = req.user; // from refresh token middleware

  const newAccessToken = jwt.sign(
    {
      userId: user.userId,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    success: true,
    data: {
      token: newAccessToken,
      expiresIn: 3600,
    },
  });
};


module.exports = {
  signup,
  login,
  getMe,
  logout,
  refreshToken
};
