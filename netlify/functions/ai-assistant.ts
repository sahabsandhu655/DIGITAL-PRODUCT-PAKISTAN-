/**
 * Netlify Function: ai-assistant
 * Server-side Gemini AI content assistant for admin dashboard.
 * Reads GEMINI_API_KEY from secure server environment.
 */

import { GoogleGenAI } from '@google/genai';

export const handler = async (event: any) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    const payload = JSON.parse(event.body || '{}');
    const { prompt } = payload;

    if (!prompt) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Prompt is required' }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: `[AI Draft for "${prompt}"]\n\nHigh-value digital asset engineered for maximum productivity. Includes step-by-step setup guidance, verified license terms, and direct Pakistani WhatsApp support. (Configure GEMINI_API_KEY in Netlify Environment Variables for live Gemini responses)`,
        }),
      };
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `You are an expert e-commerce copywriter for Digital Product Pakistan (selling e-books, verified software tools, and online courses with manual Easypaisa verification).
Generate concise, engaging, and professional product or blog copy based on this brief:
${prompt}
Do not invent prices or fake guarantees. Return clear, ready-to-publish text.`,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: response.text || 'No response generated.',
      }),
    };
  } catch (err: any) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'AI assistant error' }),
    };
  }
};
