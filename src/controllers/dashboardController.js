const dashboardService = require("../services/dashboardService");
const { successResponse, errorResponse } = require("../utils/response");

const getAdminDashboard = async (req, res) => {
  try {
    const dashboardData =
      await dashboardService.getAdminDashboardData();

    return successResponse({
      res,
      message: "Admin dashboard data fetched successfully",
      data: dashboardData,
    });
  } catch (error) {
    return errorResponse({
      res,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
};
