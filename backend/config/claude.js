import dotenv from "dotenv";
dotenv.config();

import { GoogleGenerativeAI } from '@google/generative-ai';

const getGeminiClient = () => {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not defined in .env');
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash', // Free tier mein available 
  });

  return model;
};

export default getGeminiClient;