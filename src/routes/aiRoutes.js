const express = require("express");
const aiController = require("../controllers/aiController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

/* ================= AI CHAT ================= */
router.post("/chat", authMiddleware, aiController.chatWithAI);

module.exports = router;
    