import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai.js';
import { sbApiKey, sbUrl, openAIApiKey } from './config.js';

export const supabaseClient = createClient(sbUrl, sbApiKey);

const embeddings = new OpenAIEmbeddings({ openAIApiKey });
export const vectorSore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: 'documents',
  queryName: 'match_documents',
});
export const retriever = vectorSore.asRetriever();
