const express = require('express');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Маршрут для главной страницы
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.post('/api/chat', async (req, res) => {
    console.log('Received request:', req.body);
    console.log('Using API URL:', process.env.API_URL);
    console.log('Using API Key:', process.env.API_KEY.substring(0, 10) + '...');

    try {
        const response = await fetch(process.env.API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "O",
                messages: req.body.messages
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
    console.log('Environment variables loaded:', {
        API_URL: process.env.API_URL,
        API_KEY: 'exists: ' + !!process.env.API_KEY
    });
});
