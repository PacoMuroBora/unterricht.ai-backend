import express from 'express'
import axios from 'axios'

const router = express.Router()

router.get('/', async (req, res) => {
  res.json({ msg: 'sdfysf' })
})

router.post('/prompt', async (req, res) => {
  const prompt = req.body

  console.log({ prompt })

  const response = await axios.post(
    'https://unterricht-ai-backend-wfw8.onrender.com/prompt',
    { query: prompt }
  )

  console.log({ response })

  res.json({ response: response.data })
})

export default router
