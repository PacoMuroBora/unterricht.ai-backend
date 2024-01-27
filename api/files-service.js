import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { supabaseClient } from '../utils/supabase.js';

const upload = multer({ dest: 'uploads/' }); // Set the destination folder for uploaded files
const router = express.Router();

const testUserId = '2e4ace06-270b-429b-9726-f937261ed293';

router.post('/upload', upload.single('file'), async (req, res) => {
  let _path;
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!req.user) {
      req.user = { id: testUserId };
    }

    // Access the uploaded file details
    const { originalname, mimetype, size, path, buffer } = req.file;
    _path = path;
    const fileExtension = originalname.split('.').pop();
    const { filename } = req.body;

    // Check file type
    if (!['text/plain', 'application/pdf'].includes(mimetype)) {
      // Remove the uploaded file
      fs.unlinkSync(path);
      return res.status(400).json({ error: 'Invalid file type' });
    }

    // console.log('File Details:', { originalname, mimetype, size, path });

    // TODO same file name handling
    // Check if a file with the same name exists
    // const { data: existingFiles, error: existingFilesError } =
    //   await supabaseClient.storage
    //     .from('context_uploads')
    //     .list(`user_${req.user.id}/${originalname}`);

    // console.log(existingFiles);

    // if (existingFilesError) {
    //   console.log('filename did not exist');
    //   // throw existingFilesError;
    // }

    // let finalFileName = originalname;

    // // If a file with the same name exists, add a suffix "(1)"
    // if (existingFiles && existingFiles.length > 0) {
    //   const suffix = 1;
    //   const fileNameWithoutExtension = originalname.replace(/\.[^/.]+$/, ''); // Remove file extension
    //   finalFileName = `${fileNameWithoutExtension}_${suffix}.${fileExtension}`;
    // }

    // Upload file to Supabase Storage fileData: {path, id, fullPath}
    const { data: fileData, error: fileError } = await supabaseClient.storage
      .from('context_uploads')
      .upload(`user_${req.user.id}/${filename}.${fileExtension}`, buffer);

    if (fileError) {
      throw fileError;
    }

    // Update the 'uploaded_docs' array in the 'profiles' table
    const { data: profileData, error: profileError } = await supabaseClient
      .from('profiles')
      .upsert(
        [
          {
            id: req.user.id,
            uploaded_docs: [fileData.fullPath],
          },
        ],
        { onConflict: ['id'], merge: ['uploaded_docs'] }
      );

    if (profileError) {
      throw profileError;
    }

    // Remove the uploaded file
    fs.unlinkSync(path);

    // TODO pass link to new uploaded file to AI service to generate embeddings
    // TODO link new embeddings table to the user

    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });

    fs.unlinkSync(_path);
  }
});

export default router;
