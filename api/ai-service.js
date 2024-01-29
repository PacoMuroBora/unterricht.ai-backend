import express from 'express';
import axios from 'axios';

const router = express.Router();

router.post('/prompt', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      'https://unterricht-ai-backend-wfw8.onrender.com/prompt',
      { query: prompt }
    );

    res.json({ response: response.data });
  } catch (e) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
