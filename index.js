import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import path from 'path';
import filesService from './api/files-service.js';

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
app.use(express.json());

/// serve client
app.use(express.static(path.join(__dirname, 'public')));

/// routing
app.get('/api/data', (req, res) => {
  // Handle API requests here
  res.json({ message: 'Hello from Express!' });
});

app.use('/api/files', filesService);
app.use('/api/ai', aiService);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
