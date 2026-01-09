const express = require("express");
const router = express.Router();

const orderController = require("../controllers/orderController");
const authMiddleware = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");
// Sales + Admin
router.post(
  "/",
  authMiddleware,
  rbacMiddleware(["sales", "admin"]),
  orderController.createOrder
);

// Admin → all orders
// Sales → their orders
// Viewer → read-only
router.get(
  "/",
  authMiddleware,
  rbacMiddleware(["admin", "sales", "viewer"]),
  orderController.getOrders
);

router.get(
  "/:id",
  authMiddleware,
  rbacMiddleware(["admin", "sales", "viewer"]),
  orderController.getOrderById
);

router.put(
  "/:id/status",
  authMiddleware,
  rbacMiddleware(["admin", "sales"]),
  orderController.updateOrderStatus
);

module.exports = router;
