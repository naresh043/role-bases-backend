const GEMINI_URL =
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent";

const askGemini = async ({ message, role }) => {
  const prompt = `
You are an AI assistant for an Inventory & Order Management System.

User role: ${role}

Rules:
- Enforce role-based access strictly
- Admin: users, products, orders
- Sales: orders only
- Warehouse: stock only
- Viewer: read-only
- Do NOT give permissions beyond role
- Keep responses short and clear

User question:
${message}
`;

  const response = await fetch(
    `${GEMINI_URL}?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }],
          },
        ],
      }),
    }
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
};

module.exports = askGemini;
