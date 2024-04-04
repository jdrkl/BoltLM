const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

require('dotenv').config()

const app = express();

// Port Bolt LM runs on
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Route for LM studio
app.post('/v1/chat/completions', async (req, res) => {
    try {
        const { model, messages, temperature, max_tokens, stream } = req.body;

        const chatMessages = messages ? messages : [{ role: "user", content: "Hello, what can you do for me?" }];

        const lmStudioResponse = await axios.post('http://localhost:1234/v1/chat/completions', {
            model,
            messages: chatMessages,
            temperature,
            max_tokens,
            stream
        }, {
            headers: {
                'Content-Type': 'application/json',
                // 'Authorization': '`Bearer lm-studio',
                'Authorization': `Bearer ${env.API}`,
            },
        });

        const completion = lmStudioResponse.data;

        // Return completion as JSON response
        res.json(completion.choices[0].message.content);
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
