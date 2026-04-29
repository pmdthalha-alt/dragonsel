/**
 * Dragonsel AI Client - Groq-powered generation
 * User pastes free API key from https://console.groq.com/keys
 */

// Config
const API_URL = 'https://api.groq.com/openai/v1/chat/completions';
let API_KEY = localStorage.getItem('dragonsel_api_key') || '';

// Prompts per mode for Dragonsel's original combined workspace
const PROMPTS = {
  research: `Summarize and extract key insights from this description as NotebookLM-style study guide: {desc}. Output JSON: {{"summary": "", "key_points": [], "questions": [], "sources": []}}`,
  audio: `Create podcast-style script from {desc} like NotebookLM audio overview. JSON: {{"hosts": "A,B", "sections": [{{"hook": "", "explain": "", "insight": ""}}], "length": "8min"}}`,
  slides: `Generate slide deck JSON for {desc} like NotebookLM slides. Output Reveal.js ready: {{"title": "", "slides": [{{"h": "Title", "content": "..."}}], "theme": "dark"}}. Make {num_slides} slides.`,
  design: `Create an original Dragonsel design brief for {desc}. Output JSON for the editable canvas: {{"title": "", "subtitle": "", "colors": ["#111111", "#b4122d", "#0a84ff", "#f7f6f2"], "elements": [{{"type": "text", "text": "", "style": ""}}], "layout": "launch|thumbnail|slide|poster"}}`,
  video: `CapCut timeline for {desc}. JSON: {{"duration": 30, "scenes": [{{"clip": "", "text": "", "transition": "fade"}}], "music": "upbeat"}}`,
  website: `Base44-style landing page HTML for {desc}. Full responsive HTML with sections: hero, features, CTA. Tailwind CSS.`,
  app: `Base44 dashboard app for {desc}. Editable HTML: dashboard with cards, forms, preview.`,
  export: `Package summary for project {desc}. List all assets + download manifest.`
};

async function initAI(key) {
  API_KEY = key;
  localStorage.setItem('dragonsel_api_key', key);
  console.log('Dragonsel AI ready');
}

async function generate(mode, desc, options = {}) {
  if (!API_KEY) throw new Error('Set API key first: initAI("your_key")');

  const prompt = PROMPTS[mode].replace('{desc}', desc).replace('{num_slides}', options.slides || 8);
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192', // Fast/free
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
      max_tokens: 2000
    })
  });

  if (!response.ok) throw new Error(`AI error: ${response.status}`);
  const data = await response.json();
  return data.choices[0].message.content;
}

// Render helpers
function renderSlides(jsonStr) {
  try {
    const deck = JSON.parse(jsonStr);
    const html = `
<!DOCTYPE html>
<html><head><link href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.css" rel="stylesheet">
<link href="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/theme/black.css" rel="stylesheet"><script src="https://cdn.jsdelivr.net/npm/reveal.js@5/dist/reveal.js"></script></head>
<body><div class="reveal"><div class="slides">
${deck.slides.map(s => `<section><h2>${s.h}</h2><p>${s.content}</p></section>`).join('')}
</div></div><script>Reveal.initialize({hash: true});</script></body></html>`;
    return html;
  } catch { return 'Parse error'; }
}

function renderWebsite(htmlStr) {
  return `<iframe srcdoc="${htmlStr.replace(/"/g, '"')}" style="width:100%;height:400px;border-radius:8px;border:1px solid #ccc;"></iframe>`;
}

// Export
window.DragonselAI = { initAI, generate, renderSlides, renderWebsite };

