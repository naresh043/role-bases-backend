const express = require("express");
const router = express.Router();

const productController = require("../controllers/productController");
const authMiddleware = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");

// Admin – Create product
router.post(
  "/",
  authMiddleware,
  rbacMiddleware(["admin"]),
  productController.createProduct
);

// All roles – Get products
router.get(
  "/",
  authMiddleware,
  rbacMiddleware(["admin", "sales", "warehouse", "viewer"]),
  productController.getProducts
);

// All roles – Get product by ID
router.get(
  "/:id",
  authMiddleware,
  rbacMiddleware(["admin", "sales", "warehouse", "viewer"]),
  productController.getProductById
);

// Admin – Update product
router.put(
  "/:id",
  authMiddleware,
  rbacMiddleware(["admin"]),
  productController.updateProduct
);

// Admin – Delete (soft delete)
router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware(["admin"]),
  productController.deleteProduct
);

module.exports = router;
