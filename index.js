import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import path from 'path';
import filesService, { uploadPDF } from './api/files-service.js';
import aiService, { getStandaloneQuestion } from './api/ai-service.js';

const __dirname = path.resolve();
const port = 3002;
/// express setup
const app = express();
app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

/// serve client
app.use(express.static(path.join(__dirname, 'public')));

/// routing
app.get('/api/data', (req, res) => {
  // Handle API requests here
  res.json({ message: 'Hello from Express!' });
});

app.use('/api/files', filesService);
app.use('/api/ai', aiService);

// const httpServer = http.createServer(app);
// httpServer.listen(3000);

/// tests

// uploadPDF('./testData/Pedagogy.pdf');

// getStandaloneQuestion(
//   `I am not sure but if I could I would really like to travel to a warm country with beaches.
//   I don't even know how I could afford it but I wonder which place that would be!`
// );

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
