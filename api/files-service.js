import express from 'express';
import multer from 'multer';
import fs from 'fs';
import { supabaseClient } from '../utils/supabase.js';
import axios from 'axios';

const upload = multer({ dest: 'uploads/' }); // Set the destination folder for uploaded files
const router = express.Router();

const testUserId = '2e4ace06-270b-429b-9726-f937261ed293';

const aiBackendUrl = 'http://unterricht-ai-service:10000';

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
    const { originalname, mimetype, size, path } = req.file;
    _path = path;
    const fileExtension = originalname.split('.').pop();
    const { title, description } = req.body;

    // Check file type
    if (!['text/plain', 'application/pdf'].includes(mimetype)) {
      // Remove the uploaded file
      fs.unlinkSync(path);
      return res.status(400).json({ error: 'Invalid file type' });
    }

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

    // Log the type of buffer
    const buffer = fs.readFileSync(path);

    // Upload file to Supabase Storage fileData: {path, id, fullPath}
    const { data: fileData, error: fileError } = await supabaseClient.storage
      .from('context_uploads')
      .upload(`user_${req.user.id}/${title}.${fileExtension}`, buffer);

    if (fileError) {
      throw fileError;
    }

    const fileId = fileData.id;
    // Create an entry in the "context_relations" table
    const { data: contextRelationData, error: contextRelationError } =
      await supabaseClient.from('context_relations').upsert(
        [
          {
            title,
            description,
            object_id: fileId,
            embeddings_table: null,
          },
        ],
        {
          onConflict: ['id'],
          merge: ['title', 'description', 'object_id', 'embeddings_table'],
        }
      );

    if (contextRelationError) {
      throw contextRelationError;
    }

    const res = await axios.post(`${aiBackendUrl}/upload`, buffer, {
      'Content-Type': mimetype,
    });

    const { vector_store_ids } = res.data;

    // update the field embeddings_table in the context_relations table
    const { data: updateResult, error: updateError } = await supabaseClient
      .from('context_relations')
      .update({ vector_store_ids })
      .eq('object_id', fileId);

    if (updateError) {
      throw updateError;
    }

    res
      .status(200)
      .json({ message: 'File uploaded successfully', contextRelationData });
    // Remove the uploaded file
    fs.unlinkSync(path);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });

    try {
      if (_path) fs.unlinkSync(_path);
    } catch (error) {
      console.error('Error:', error);
    }
  }
});

export default router;
