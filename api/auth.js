import express from 'express';
import { supabaseClient } from '../utils/supabase.js';

const router = express.Router();

// Endpoint for user registration
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Create a new user in Supabase Auth
    const { user, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Insert user into the Supabase table
    const { data, _error } = await supabase
      .from('profiles')
      .upsert([{ email, username }], { onConflict: ['email'] });

    if (_error) {
      throw _error;
    }

    // Additional logic, such as saving user details to a Supabase table

    res.status(201).json({ user, userData: data[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint for user login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Sign in the user
    const { user, session, error } = await supabaseClient.auth.signIn({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    // Update last_login for the user
    const { data, _error } = await supabase
      .from('users')
      .update({ last_login: new Date() })
      .eq('email', email);

    if (_error) {
      throw _error;
    }

    res.status(200).json({ user, session, userData: data[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Example protected route
router.get('/protected', async (req, res) => {
  try {
    // Check if the request is authenticated
    const { user, error } = await supabaseClient.auth.api.getUserByCookie(req);

    if (error) {
      throw error;
    }

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Perform actions for authenticated users

    res.status(200).json({ message: 'Protected route accessed', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
