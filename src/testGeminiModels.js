require("dotenv").config();
const GEMINI_LIST_MODELS_URL =
  "https://generativelanguage.googleapis.com/v1/models";

(async () => {
  const response = await fetch(
    `${GEMINI_LIST_MODELS_URL}?key=${process.env.GEMINI_API_KEY}`
  );

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
})();
