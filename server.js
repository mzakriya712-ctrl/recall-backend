const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Base Academic Prompt
const ACADEMIC_PROMPT = `You are an expert clinical instructor and senior academic textbook contributor. Analyze the provided study text or evaluation segment with absolute academic precision.

Apply the following evaluation frameworks seamlessly:
1. AIRWAY, BREATHING, CIRCULATION (ABC): Prioritize acute physiological and respiratory stability factors within the text.
2. MASLOW'S HIERARCHY OF NEEDS: Prioritize core safety and survival concepts over secondary variables.
3. LOGICAL PROCESS FLOW: Determine the immediate, most appropriate priority action or definitive concept required by the core clinical scenario.

Output Specification:
- State the final absolute correct choice or matching statement clearly in bold at the very top (e.g., "**Correct Answer: Option X**").
- Provide a high-yield, 1-2 sentence core rationalized concept explaining the physiological or clinical 'why'.`;

// Test Route
app.get('/', (req, res) => {
    res.send('Academic Recall Engine with Gemini & Groq is Running!');
});

// Unified Purify Endpoint supporting both Groq and Gemini
app.post('/purify', async (req, res) => {
    try {
        const { text, model } = req.body;
        if (!text) {
            return res.status(400).json({ error: "No text provided" });
        }

        // Check if extension specifically requested Groq OR if Gemini is not available
        if (model === 'groq' || !process.env.GEMINI_API_KEY) {
            console.log("Processing with Groq AI...");
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama3-8b-8192",
                    messages: [
                        { role: "system", content: ACADEMIC_PROMPT },
                        { role: "user", content: text }
                    ],
                    temperature: 0.2
                })
            });

            const data = await response.json();
            const purifiedText = data.choices[0].message.content;
            return res.json({ purifiedText, source: 'groq' });
        } 
        
        // Default to Gemini Flash
        console.log("Processing with Gemini Flash...");
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: `${ACADEMIC_PROMPT}\n\nText to analyze:\n${text}` }] }]
            })
        });

        const data = await response.json();
        const purifiedText = data.candidates[0].content.parts[0].text;
        return res.json({ purifiedText, source: 'gemini' });

    } catch (error) {
        console.error("Error during text purification:", error);
        res.status(500).json({ error: "Internal Server Error", details: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));