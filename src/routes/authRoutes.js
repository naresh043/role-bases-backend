const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const refreshAuthMiddleware=require('../middlewares/refreshAuthMiddleware')

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/me", authMiddleware, authController.getMe);
router.post("/logout", authMiddleware, authController.logout);
router.post("/refresh", refreshAuthMiddleware, authController.refreshToken);


module.exports = router;
