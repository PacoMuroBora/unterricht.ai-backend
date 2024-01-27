import express from 'express';
import { openAIApiKey } from '../utils/config.js';
import { retriever } from '../utils/supabase.js';

const router = express.Router();

const llm = new ChatOpenAI({ openAIApiKey, temperature: 1 });

router.get('/', async (req, res) => {
  res.json({ msg: 'sdfysf' });
});

router.post('/prompt', async (req, res) => {
  const { prompt } = req.body;

  res.json({ response: `WIP: ${prompt}` });
});

export default router;
