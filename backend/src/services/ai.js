// AI service wrapper for OpenAI
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_BASE_URL = 'https://api.openai.com/v1';

async function generateFromPrompt(prompt, system = 'You are a helpful assistant.') {
  try {
    const response = await axios.post(
      `${OPENAI_BASE_URL}/chat/completions`,
      {
        model: 'gpt-4',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (err) {
    console.error('OpenAI API error:', err);
    throw new Error('Failed to generate content');
  }
}

async function generateStructured(prompt, system, schema) {
  try {
    const response = await axios.post(
      `${OPENAI_BASE_URL}/chat/completions`,
      {
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.7,
        max_tokens: 4000,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;
    return JSON.parse(content);
  } catch (err) {
    console.error('OpenAI structured generation error:', err);
    return { error: 'Failed to generate structured content', raw: err.message };
  }
}

async function classifyIntent(prompt) {
  const system = `You are an intent classifier for a creative AI platform. Classify the user's request into one of these categories: design, video, audio, slides, research, website, app, export, all. Respond with JSON: {"intent": "category", "confidence": 0.95, "tools": ["tool1", "tool2"]}.`;
  
  try {
    const response = await axios.post(
      `${OPENAI_BASE_URL}/chat/completions`,
      {
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: system },
          { role: 'user', content: `Classify this request: "${prompt}"` },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
        max_tokens: 500,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = JSON.parse(response.data.choices[0].message.content);
    return {
      intent: content.intent || 'all',
      confidence: content.confidence || 0.8,
      tools: content.tools || [content.intent || 'all'],
    };
  } catch (err) {
    console.error('Intent classification error:', err);
    return fallbackIntentClassification(prompt);
  }
}

function fallbackIntentClassification(prompt) {
  const value = prompt.toLowerCase();
  const has = (words) => words.some((word) => value.includes(word));

  const buckets = {
    video: ['video', 'reel', 'short', 'caption', 'scene', 'timeline', 'transition', 'clip', 'trailer'],
    audio: ['podcast', 'audio', 'voice', 'host', 'episode', 'voiceover', 'listen'],
    website: ['website', 'site', 'landing page', 'web page', 'homepage', 'portfolio'],
    app: ['app', 'dashboard', 'portal', 'saas', 'tool', 'form', 'database'],
    slides: ['slide', 'slides', 'deck', 'presentation', 'pitch'],
    design: ['design', 'brand', 'logo', 'poster', 'thumbnail', 'social post', 'graphic'],
    research: ['research', 'notes', 'summarize', 'summary', 'study', 'source', 'question', 'document'],
  };

  const hits = Object.entries(buckets).filter(([, words]) => has(words)).map(([tool]) => tool);
  if (hits.length > 1 || has(['everything', 'all-in-one', 'all in one', 'launch system', 'complete package', 'full project'])) {
    return { intent: 'all', confidence: 0.7, tools: ['research', 'design', 'video', 'website', 'slides'] };
  }
  return { intent: hits[0] || 'research', confidence: 0.6, tools: [hits[0] || 'research'] };
}

module.exports = {
  generateFromPrompt,
  generateStructured,
  classifyIntent,
};
