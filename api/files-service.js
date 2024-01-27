import express from 'express';
import multer from 'multer';
import fs from 'fs';

const upload = multer({ dest: 'uploads/' }); // Set the destination folder for uploaded files
const router = express.Router();

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    if (!req.user) {
      req.user = { id: '000' };
    }

    // Access the uploaded file details
    const { originalname, mimetype, size, path, buffer } = req.file;

    // Check file type
    if (!['text/plain', 'application/pdf'].includes(mimetype)) {
      // Remove the uploaded file
      fs.unlinkSync(path);
      return res.status(400).json({ error: 'Invalid file type' });
    }

    console.log('File Details:', { originalname, mimetype, size, path });

    // Upload file to Supabase Storage
    const { data: fileData, error: fileError } = await supabase.storage
      .from('context_uploads')
      .upload(`user_${req.user.id}/${originalname}`, buffer);

    if (fileError) {
      throw fileError;
    }

    // Update the 'uploaded_docs' array in the 'profiles' table
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update({
        uploaded_docs: supabase.sql`array_append(uploaded_docs, ${fileData[0].id})`,
      })
      .eq('user_id', req.user.id);

    // Remove the uploaded file
    fs.unlinkSync(path);

    // TODO pass link to new uploaded file to AI service to generate embeddings
    // TODO link new embeddings table to the user

    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
