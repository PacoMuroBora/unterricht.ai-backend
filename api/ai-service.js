import express from 'express';
import axios from 'axios';

const router = express.Router();

const aiBackendUrl = 'http://unterricht-ai-service:10000';

router.post('/prompt', async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(`${aiBackendUrl}/prompt`, {
      query: prompt,
    });

    res.json({ response: response.data });
  } catch (e) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
