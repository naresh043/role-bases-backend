const express = require("express");
const router = express.Router();

const stockController = require("../controllers/stockController");
const authMiddleware = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");

// Update stock
router.put(
  "/update",
  authMiddleware,
  rbacMiddleware(["admin", "warehouse"]),
  stockController.updateStock
);

// Get stock logs
router.get(
  "/logs",
  authMiddleware,
  rbacMiddleware(["admin", "warehouse"]),
  stockController.getStockLogs
);

module.exports = router;
