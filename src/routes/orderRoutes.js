const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
// Sales + Admin
router.post(
  "/",
  authMiddleware,
  rbacMiddleware("sales", "admin"),
  orderController.createOrder
);

// Admin → all orders
// Sales → their orders
// Viewer → read-only
router.get(
  "/",
  authMiddleware,
  rbacMiddleware("ADMIN", "SALES", "VIEWER"),
  orderController.getOrders
);

router.get(
  "/:id",
  authMiddleware,
  rbacMiddleware("ADMIN", "SALES", "VIEWER"),
  orderController.getOrderById
);

router.put(
  "/:id/status",
  authMiddleware,
  rbacMiddleware("ADMIN", "SALES"),
  orderController.updateOrderStatus
);

module.exports = router;
