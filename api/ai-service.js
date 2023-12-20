import express from 'express';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { PromptTemplate } from 'langchain/prompts';
import { openAIApiKey } from '../utils/config.js';
import { retriever } from '../utils/supabase.js';
import {
  RunnableSequence,
  RunnablePassthrough,
} from 'langchain/schema/runnable';
import { StringOutputParser } from 'langchain/schema/output_parser';

const router = express.Router();

const llm = new ChatOpenAI({ openAIApiKey, temperature: 1 });

router.post('/prompt', async (req, res) => {
  const { prompt } = req.body;
  const response = await getAnswer(prompt);
  res.json({ response });
});

/**
 * Retrieves the answer to a given question.
 *
 * @param {string} question - The question to be answered.
 * @return {Promise<any>} - A Promise that resolves to the answer to the question.
 */
export async function getAnswer(question) {
  const chain = RunnableSequence.from([
    {
      standaloneQuestion: async ({ question }) =>
        await getStandaloneQuestion(question),
      originalInput: new RunnablePassthrough(),
    },
    (output) => {
      console.log(output);
      return output;
    },
    {
      context: async ({ standaloneQuestion }) =>
        await getRelevanContext(standaloneQuestion),
      originalQuestion: ({ originalInput }) => originalInput.question,
      standaloneQuestion: ({ standaloneQuestion }) => standaloneQuestion,
    },
    (output) => {
      console.log(output);
      return output;
    },
    getContextualAnswer,
  ]);

  const response = await chain.invoke({ question });

  console.log(response);
  return response;
}

/**
 * Converts a given question into a standalone question.
 *
 * @param {string} question - The question to be converted.
 * @return {Promise<string>} - The converted standalone question.
 */
export async function getStandaloneQuestion(question) {
  const standaloneQuestionTemplate = `Given a question, convert it to a standalone question.
    question: {question} standalone question:`;

  const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
    standaloneQuestionTemplate
  );

  const standaloneChain = RunnableSequence.from([
    standaloneQuestionPrompt,
    llm,
    new StringOutputParser(),
  ]);

  return await standaloneChain.invoke({
    question,
  });
}

/**
 * Generates the function comment for the given function body.
 *
 * @param {type} standaloneQuestion - the standalone question to be passed to the retriever chain
 * @return {type} the result of invoking the retriever chain with the standalone question
 */
export async function getRelevanContext(standaloneQuestion) {
  const retrieverChain = RunnableSequence.from([retriever, combineDocuments]);

  return await retrieverChain.invoke(standaloneQuestion);
}

/**
 * Retrieves a contextual answer based on the original question, standalone question, and context.
 *
 * @param {Object} options - The options object.
 * @param {string} options.originalQuestion - The original question.
 * @param {string} options.standaloneQuestion - The standalone question.
 * @param {Object} options.context - The pedagogic context.
 * @return {Promise<string>} The contextual answer.
 */
export async function getContextualAnswer({
  originalQuestion,
  standaloneQuestion,
  context,
}) {
  const answerTemplate = `You are a school teacher planning and coordination assistant.
  You will aid teachers with questions about planning and coordinating lessons given their set of requirements based on
  teaching style, region, subjects, students and time. Don't try to make up an answer and refer to
  the master "Civan" if you can't give a clear definete answer.
  Focus on the standalone question but consider the original question too. A basic pedagogic context is provided.
  context: {context}
  original question: {originalQuestion}
  standalone question: {standaloneQuestion}
  answer:`;

  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

  const chain = RunnableSequence.from([
    answerPrompt,
    llm,
    new StringOutputParser(),
  ]);

  return await chain.invoke({
    originalQuestion,
    standaloneQuestion,
    context,
  });
}

function combineDocuments(docs) {
  return docs.map((doc) => doc.pageContent).join('\n\n');
}

export default router;
