import { createClient } from '@supabase/supabase-js';
import { sbApiKey, sbUrl } from './config.js';

export const supabaseClient = createClient(sbUrl, sbApiKey);
