/**
 * Standard API Response Utility
 */

const successResponse = ({
  res,
  message = "Success",
  data = null,
  statusCode = 200,
  pagination = null,
}) => {
  const response = {
    success: true,
    message,
    data,
  };

  if (pagination) {
    response.pagination = pagination;
  }

  return res.status(statusCode).json(response);
};

const errorResponse = ({
  res,
  message = "Something went wrong",
  statusCode = 500,
  code = "INTERNAL_ERROR",
  details = null,
}) => {
  const response = {
    success: false,
    message,
    error: {
      code,
      details,
    },
  };

  return res.status(statusCode).json(response);
};
const ERROR_CODES = {
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_ERROR: "INTERNAL_ERROR",
};

module.exports = {
  successResponse,
  errorResponse,
};
