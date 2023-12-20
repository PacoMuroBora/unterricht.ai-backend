import express from 'express';
import { OpenAI } from 'langchain/llms/openai';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';
import { openAIApiKey } from '../utils/config.js';
import { retriever } from '../utils/supabase.js';
import { RunnableSequence } from 'langchain/schema/runnable';
import { StringOutpitParser } from 'langchain/schema/output_parser';

const router = express.Router();

const llm = new ChatOpenAI({ openAIApiKey, temperature: 1 });

router.post('/prompt', async (req, res) => {
  const { prompt } = req.body;
  const model = new OpenAI();
  const response = await model.call(prompt);
  res.json({ response });
});

export async function getAnswer(question) {
  const chain = RunnableSequence.from([]);

  chain.invoke({ question });
}

export async function getStandaloneQuestion(question) {
  const standaloneQuestionTemplate = `Given a question, convert it to a standalone question.
    question: {question} standalone question:`;

  const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  const standaloneQuestionChain = standaloneQuestionPrompt.pipe(llm);

  const response = await standaloneQuestionChain.invoke({
    question,
  });

  return response;
}

export async function getContextOnlyAnswer() {
  const answerTemplate = `You are a school teacher planning and coordination assistant.
  You will aid teachers with questions about planning and coordinating lessons given their set of requirements based on
  teaching style, region, subjects, students and time. Don't try to make up an answer and refer to
  the master "Civan" if you can't give a clear definete answer. A basic pedagogic context is provided.
  context: {context}
  question: {question}
  answer:`;

  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);
}

function combineDocuments(docs) {
  return docs.map((doc) => doc.pageContent).join('\n\n');
}

export default router;
