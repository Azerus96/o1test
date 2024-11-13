const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.post('/api/chat', async (req, res) => {
    console.log('Received request:', req.body);

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "o1-preview", // Используем новую модель O1
                messages: req.body.messages,
                temperature: 0, // Для более точных ответов
                max_tokens: 150 // Ограничение длины ответа
            })
        });

        console.log('API Response Status:', response.status);
        const data = await response.json();
        console.log('API Response Data:', data);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${JSON.stringify(data)}`);
        }

        res.json(data);
    } catch (error) {
        console.error('Detailed Error:', error);
        res.status(500).json({ 
            error: 'Failed to get response from API',
            details: error.message
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
