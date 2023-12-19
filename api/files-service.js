import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { PDFLoader } from 'langchain/document_loaders/fs/pdf';
import { TextLoader } from 'langchain/document_loaders/fs/text';
import {
  RecursiveCharacterTextSplitter,
  CharacterTextSplitter,
} from 'langchain/text_splitter';

const upload = multer({ dest: 'uploads/' }); // Set the destination folder for uploaded files

const router = express.Router();

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Access the uploaded file details
    const { originalname, mimetype, size, path } = req.file;

    // Check file type
    if (!['text/plain', 'application/pdf'].includes(mimetype)) {
      // Remove the uploaded file
      fs.unlinkSync(path);
      return res.status(400).json({ error: 'Invalid file type' });
    }

    console.log('File Details:', { originalname, mimetype, size, path });

    if (mimetype === 'text/plain') {
      await uploadText(path);
    } else if (mimetype === 'application/pdf') {
      await uploadPDF(path);
    }

    // Remove the uploaded file
    fs.unlinkSync(path);

    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 500,
  chunkOverlap: 50,
});

async function uploadText(path) {
  const loader = new TextLoader(path);
  const doc = await loader.load();

  const docOutput = await splitter.splitDocuments([doc]);
}

export async function uploadPDF(path) {
  const loader = new PDFLoader(path, {
    splitPages: false,
  });

  const output = await loader.loadAndSplit(
    new CharacterTextSplitter({
      separator: '. ',
      chunkSize: 2500,
      chunkOverlap: 200,
    })
  );

  console.log(output);
}

export default router;
