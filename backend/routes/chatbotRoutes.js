const express = require("express");
const router = express.Router();
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

router.post("/", async (req, res) => {
    try {
        const userMessage = req.body.message;
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        // Explicit context to force medical response
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [
                        { text: "You are a medical assistant specializing in disease prediction. When I describe symptoms, suggest possible diseases and explanations. Try to to give simple explainations that patient understands. Try not to mislead the patient. If the disease is an extreme case, do not panic the patient, handle with care. Strictly give only Medical responses, if questions other than disease predictions are asked tell them that you are a medical assistant and cannot assist in these types of request." }
                    ]
                },
                { role: "user", parts: [{ text: userMessage }] } // Ensures context is applied
            ],
        });

        const result = await chat.sendMessage(userMessage);
        const responseText = result.response.text().trim();

        res.json({ response: responseText });
    } catch (error) {
        console.error("Gemini API Error:", error);
        res.status(500).json({ error: "Failed to process the request" });
    }
});

module.exports = router;
