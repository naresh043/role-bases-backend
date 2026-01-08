const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const rbacMiddleware = require("../middlewares/rbacMiddleware");

/* Admin-only user management */
router.post(
  "/",
  authMiddleware,
  rbacMiddleware(["admin"]),
  userController.createUser
);

router.get(
  "/",
  authMiddleware,
  rbacMiddleware(["admin"]),
  userController.getUsers
);

router.put(
  "/:id/role",
  authMiddleware,
  rbacMiddleware(["admin"]),
  userController.updateUserRole
);

router.delete(
  "/:id",
  authMiddleware,
  rbacMiddleware(["admin"]),
  userController.deleteUser
);

module.exports = router;
