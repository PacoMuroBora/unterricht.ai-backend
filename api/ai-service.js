import express from 'express'
import axios from 'axios'

const router = express.Router()

//const aiBackendUrl = 'http://unterricht-ai-service:10000';
const aiBackendUrl =
  'https://unterricht-ai-backend-wfw8.onrender.com/prompt'

router.get('/ping', async (req, res) => {
  try {
    const response = await axios.get(`${aiBackendUrl}`)
    res.json({ response: response.data })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/prompt', async (req, res) => {
  try {
    const response = await axios.post(
      `${aiBackendUrl}/prompt`,
      req.body
    )
    console.log(response)
    res.json({ response: response.data })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
