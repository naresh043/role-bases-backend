const { errorResponse } = require("../utils/response");

const rbacMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse({
        res,
        message: "Access denied",
        statusCode: 403,
        code: "FORBIDDEN",
      });
    }
    next();
  };
};

module.exports = rbacMiddleware;
