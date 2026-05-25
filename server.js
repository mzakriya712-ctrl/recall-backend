// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors({
    origin: '*', // Allow all origins for development
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// API Endpoint
app.post('/api/analyze', async (req, res) => {
    try {
        const { text } = req.body;

        if (!text) {
            return res.status(400).json({ success: false, error: "No text provided" });
        }

        // --- Logic for calling your AI API goes here ---
        // Example: const response = await callAI(text);
        
        console.log("Received text:", text);

        // Simulated response
        res.status(200).json({ 
            success: true, 
            analysis: "This is a placeholder for your AI analysis result." 
        });

    } catch (error) {
        console.error("Error processing request:", error.message);
        res.status(500).json({ 
            success: false, 
            error: "Internal Server Error" 
        });
    }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running smoothly on port ${PORT}`);
});