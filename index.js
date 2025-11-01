// Required modules
const express = require('express');
const cors = require('cors');
const knowledgeBase = require('./feedhive.json'); // JSON file path

// Initialize Express app
const app = express();
app.use(cors()); // Allow frontend requests
app.use(express.json()); // Parse JSON request body

// Server port
const PORT = process.env.PORT || 3000;

// Chat API endpoint
app.post('/api/chat', (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ answer: "Please provide a question." });
  }

  // Search for matching FAQ
  const faq = knowledgeBase.faqs.find(f =>
    question.toLowerCase().includes(f.q.toLowerCase())
  );

  if (faq) {
    res.json({ answer: faq.a });
  } else {
    res.json({ answer: "Sorry, I don't know the answer to that yet." });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
