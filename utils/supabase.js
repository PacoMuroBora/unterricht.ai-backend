import { createClient } from '@supabase/supabase-js';
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
import { sbApiKey, sbUrl, openAIApiKey } from './config.js';

console.log({ sbApiKey, sbUrl, openAIApiKey })

export const supabaseClient = createClient(sbUrl, sbApiKey);

const embeddings = new OpenAIEmbeddings({ openAIApiKey });
export const vectorSore = new SupabaseVectorStore(embeddings, {
  client: supabaseClient,
  tableName: 'documents_nrw',
  queryName: 'match_documents_nrw',
});
export const retriever = vectorSore.asRetriever();
