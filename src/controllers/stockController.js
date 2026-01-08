const stockService = require("../services/stockService");
const { successResponse, errorResponse } = require("../utils/response");

const updateStock = async (req, res) => {
  try {
    const data = await stockService.updateStock(req.body, req.user);

    return successResponse({
      res,
      message: "Stock updated successfully",
      data,
    });
  } catch (error) {
    return errorResponse({
      res,
      message: error.message,
    });
  }
};

const getStockLogs = async (req, res) => {
  try {
    const logs = await stockService.getStockLogs(req.query);

    return successResponse({
      res,
      message: "Stock logs fetched successfully",
      data: logs,
    });
  } catch (error) {
    return errorResponse({
      res,
      message: error.message,
    });
  }
};

module.exports = {
  updateStock,
  getStockLogs,
};
