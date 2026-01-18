const askGemini = require("../services/geminiService");
const { successResponse, errorResponse } = require("../utils/response");

/* ================= CHAT WITH AI ================= */
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    // 🔐 Role comes from auth middleware (JWT)
    const role = req.user?.role;

    /* ===== VALIDATION ===== */
    if (!message) {
      return errorResponse({
        res,
        message: "Message is required",
        statusCode: 400,
        code: "VALIDATION_ERROR",
      });
    }

    if (!role) {
      return errorResponse({
        res,
        message: "User role not found",
        statusCode: 401,
        code: "UNAUTHORIZED",
      });
    }

    /* ===== AI CALL ===== */
    const reply = await askGemini({
      message,
      role,
    });

    /* ===== SUCCESS RESPONSE ===== */
    return successResponse({
      res,
      message: "AI response generated successfully",
      data: {
        reply,
      },
    });
  } catch (error) {
    console.error("AI Controller Error:", error);

    return errorResponse({
      res,
      message: error.message || "AI service failed",
      statusCode: 500,
      code: "AI_ERROR",
    });
  }
};

module.exports = {
  chatWithAI,
};
