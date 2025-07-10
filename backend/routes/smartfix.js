const express = require("express");
const router = express.Router();
require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
  const { code, language } = req.body;
  
  const prompt = `
You are an expert ${language} programmer. Fix all syntax and runtime errors in the following code. 

For C++, always include '#include<bits/stdc++.h>' and use 'using namespace std;'. Optimize and clean the code where possible. 

Only return the corrected code. Do not include any explanation or extra text.


\`\`\`${language}
${code}
\`\`\`
`;

  try {
    // Use Gemini 2.5 Flash model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // or "gemini-pro"

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const fixedText = response.text();

    res.json({ fixedCode: fixedText.trim() });
  } catch (err) {
    console.error("SmartFix Gemini Error:", err.message);
    res.status(500).json({ error: "SmartFix failed with Gemini." });
  }
});

module.exports = router;
