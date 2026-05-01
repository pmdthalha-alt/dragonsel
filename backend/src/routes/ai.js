const express = require('express');
const router = express.Router();
const { generateFromPrompt, generateStructured, classifyIntent } = require('../services/ai');

// Generate content for a specific tool
router.post('/generate', async (req, res, next) => {
  try {
    const { prompt, tool, context, sources } = req.body;
    
    if (!prompt || !tool) {
      return res.status(400).json({ error: 'Prompt and tool are required' });
    }

    const systemPrompt = getSystemPromptForTool(tool);
    const userPrompt = buildUserPrompt(prompt, tool, context, sources);
    
    const result = await generateStructured(userPrompt, systemPrompt, getToolSchema(tool));
    
    res.json({
      success: true,
      tool,
      data: result,
      generatedAt: new Date().toISOString(),
    });
  } catch (err) {
    next(err);
  }
});

// Classify user intent from prompt
router.post('/intent', async (req, res, next) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const intent = await classifyIntent(prompt);
    
    res.json({
      success: true,
      intent,
      confidence: intent.confidence,
    });
  } catch (err) {
    next(err);
  }
});

// Quick generate for chat responses
router.post('/chat', async (req, res, next) => {
  try {
    const { message, history, projectContext } = req.body;
    
    const systemPrompt = `You are Dragonsel, an elite AI creative assistant that helps users build projects across design, video, research, websites, and apps. You are concise, helpful, and action-oriented. You route users to the right creative workspace based on their needs.`;
    
    const contextBlock = projectContext ? `
Current project: ${projectContext.name || 'Untitled'}
Goal: ${projectContext.goal || 'Not set'}
Audience: ${projectContext.audience || 'Not set'}
Style: ${projectContext.style || 'Not set'}
Sources: ${projectContext.sources?.length || 0} items
Assets: ${projectContext.assets?.length || 0} items
` : '';

    const userPrompt = `${contextBlock}
User message: ${message}

Respond helpfully. If the user wants to create something, suggest which workspace to open. Keep responses under 3 sentences when possible.`;
    
    const result = await generateFromPrompt(userPrompt, systemPrompt);
    
    res.json({
      success: true,
      response: result,
    });
  } catch (err) {
    next(err);
  }
});

function getSystemPromptForTool(tool) {
  const prompts = {
    research: `You are a research assistant. Generate structured research outputs including a summary, key points, and follow-up questions. Be thorough and insightful. Output as JSON.`,
    
    audio: `You are a podcast scriptwriter. Create a two-host podcast script with natural conversation flow. Include host names, roles, and dialogue sections. Output as JSON.`,
    
    slides: `You are a presentation designer. Create a slide deck outline with compelling story arc. Each slide has a heading and body content. Output as JSON with slides array.`,
    
    design: `You are a brand designer. Generate design specifications including color palette, typography suggestions, and layout recommendations. Output as JSON.`,
    
    video: `You are a video producer. Create a video scene breakdown with timestamps, descriptions, transitions, and caption suggestions. Output as JSON.`,
    
    website: `You are a web designer and developer. Generate a complete website specification with brand colors, page structure, and HTML content. Output as JSON.`,
    
    app: `You are a product designer. Generate an app specification with screens, data models, and user actions. Output as JSON.`,
    
    export: `You are a project manager. Generate a project manifest and export package description. Output as JSON.`,
  };
  
  return prompts[tool] || prompts.research;
}

function buildUserPrompt(prompt, tool, context, sources) {
  const ctx = context || {};
  const srcList = (sources || []).map(s => `- ${s.title}: ${s.content?.slice(0, 200)}`).join('\n');
  
  return `User request: "${prompt}"

Project Context:
- Audience: ${ctx.audience || 'General audience'}
- Goal: ${ctx.goal || 'Create compelling content'}
- Style: ${ctx.style || 'Clean and professional'}
- Project name: ${ctx.name || 'Untitled'}

${sources?.length ? `Sources:\n${srcList}` : ''}

Generate a complete ${tool} output based on this request.`;
}

function getToolSchema(tool) {
  const schemas = {
    research: {
      type: 'object',
      properties: {
        summary: { type: 'string' },
        keyPoints: { type: 'array', items: { type: 'string' } },
        questions: { type: 'array', items: { type: 'string' } },
        sources: { type: 'array', items: { type: 'string' } },
      },
      required: ['summary', 'keyPoints', 'questions'],
    },
    audio: {
      type: 'object',
      properties: {
        voices: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              role: { type: 'string' },
              tone: { type: 'string' },
            },
          },
        },
        sections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              host: { type: 'string' },
              text: { type: 'string' },
            },
          },
        },
        title: { type: 'string' },
      },
      required: ['voices', 'sections', 'title'],
    },
    slides: {
      type: 'object',
      properties: {
        slides: {
          type: 'array',
          items: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        title: { type: 'string' },
      },
      required: ['slides', 'title'],
    },
    design: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        subtitle: { type: 'string' },
        colors: { type: 'array', items: { type: 'string' } },
        layout: { type: 'string' },
        fonts: { type: 'array', items: { type: 'string' } },
      },
      required: ['title', 'colors', 'layout'],
    },
    video: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        duration: { type: 'number' },
        scenes: {
          type: 'array',
          items: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        captions: { type: 'array', items: { type: 'string' } },
      },
      required: ['title', 'scenes'],
    },
    website: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        brand: {
          type: 'object',
          properties: {
            colors: { type: 'array', items: { type: 'string' } },
            tone: { type: 'string' },
          },
        },
        pages: { type: 'array', items: { type: 'string' } },
        sections: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string' },
              heading: { type: 'string' },
              body: { type: 'string' },
            },
          },
        },
      },
      required: ['title', 'pages'],
    },
    app: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        screens: { type: 'array', items: { type: 'string' } },
        data: { type: 'array', items: { type: 'string' } },
        actions: { type: 'array', items: { type: 'string' } },
      },
      required: ['title', 'screens'],
    },
    export: {
      type: 'object',
      properties: {
        manifest: { type: 'object' },
        assets: { type: 'array' },
        notes: { type: 'string' },
      },
      required: ['manifest'],
    },
  };
  
  return schemas[tool] || schemas.research;
}

module.exports = router;
