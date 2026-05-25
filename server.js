const express = require('express');
const cors = require('cors'); // Run: npm install cors
const app = express();

// CORS enabled to allow requests from your browser extension
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

app.post('/api/analyze', async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ error: "No text provided" });

        // Logic for calling Groq/Gemini goes here using process.env.YOUR_API_KEY
        // Example: const response = await callAI(text);
        
        res.json({ success: true, analysis: "Analysis result here" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));