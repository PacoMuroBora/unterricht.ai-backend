import 'dotenv/config';
import bodyParser from 'body-parser';
import express from 'express';
import cors from 'cors';
import path from 'path';
import authService from './api/auth.js';
import filesService from './api/files-service.js';
import morgan from 'morgan';

const __dirname = path.resolve();
const port = 3002;
/// express setup
const app = express();

app.use(morgan('combined'));

app.use(cors());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.json());

/// serve client
app.use(express.static(path.join(__dirname, 'public')));

app.get('/ping', (req, res) => {
  res.send('pong');
});

/// routing
app.get('/api/data', (req, res) => {
  // Handle API requests here
  res.json({ message: 'Hello from Express!' });
});

app.use('/api/auth', authService);
app.use('/api/files', filesService);
// app.use('/api/ai', aiService);

// app.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });

// Export the handler function
export default async function handler(req, res) {
  await app(req, res);
}
