const express = require("express");
const router = express.Router();

const dashboardController = require("../controllers/dashboardController");
const authMiddleware = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");

// Admin dashboard
router.get(
  "/admin",
  authMiddleware,
  rbacMiddleware(["admin","sales"]),
  dashboardController.getAdminDashboard
);

module.exports = router;
