const express = require('express');
const cors = require('cors');
const knowledgeBase = require('./feedhive.json');
require('dotenv').config(); // Load .env variables
const fetch = require('node-fetch'); // If using Node 18+ fetch built-in

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DEEPSEEK_API_KEY = process.env.DEESEEK_API_KEY;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { question } = req.body;
  if (!question) {
    return res.status(400).json({ answer: "Please provide a question." });
  }

  // Search local JSON first
  const faq = knowledgeBase.faqs.find(f =>
    question.toLowerCase().includes(f.q.toLowerCase())
  );

  if (faq) {
    return res.json({ answer: faq.a });
  }

  // If not found, call DeepSeek API
  try {
    const response = await fetch('https://api.deepseek.ai/v1/query', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEESEEK_API_KEY}`
      },
      body: JSON.stringify({ query: question })
    });

    const data = await response.json();

    if (data && data.answer) {
      res.json({ answer: data.answer });
    } else {
      res.json({ answer: "Sorry, I couldn't find an answer." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Error connecting to DeepSeek API." });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
