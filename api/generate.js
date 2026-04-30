function parseBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}

function titleFromPrompt(prompt) {
  return (prompt || "Dragonsel Project")
    .replace(/^(create|build|make|generate|design)\s+/i, "")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .split(/\s+/)
    .slice(0, 6)
    .join(" ") || "Dragonsel Project";
}

function cleanText(value, fallback) {
  return String(value || fallback || "").trim();
}

function makePayload(tool, prompt, project = {}) {
  const title = titleFromPrompt(prompt);
  const context = project.context || {};
  const audience = cleanText(context.audience, "creators, students, and founders");
  const goal = cleanText(context.goal, "turn an idea into a usable project");
  const style = cleanText(context.style, "clean, premium, and fast");
  const common = {
    title,
    prompt,
    context: { audience, goal, style },
    sources: Array.isArray(project.sources) ? project.sources : [],
    createdAt: new Date().toISOString(),
    generatedBy: "dragonsel-serverless"
  };

  if (tool === "audio") {
    return {
      ...common,
      voices: [
        { name: "Host A", role: "curious guide", tone: "warm and clear" },
        { name: "Host B", role: "practical analyst", tone: "direct and useful" }
      ],
      sections: [
        { host: "A", text: `Today we are unpacking ${title} for ${audience}.` },
        { host: "B", text: `The goal is to ${goal}, with a ${style} feel.` },
        { host: "A", text: "Dragonsel keeps the script, notes, and exports connected in one workspace." },
        { host: "B", text: "The first version is ready to edit, refine, and export." }
      ]
    };
  }

  if (tool === "slides") {
    return {
      ...common,
      slides: [
        { title: title, bullets: ["What it is", "Who it helps", "Why now"], notes: "Open with the user problem." },
        { title: "The System", bullets: ["Project brain", "Smart workspaces", "Connected exports"], notes: "Show how the modules work together." },
        { title: "Workflow", bullets: ["Describe", "Generate", "Edit", "Export"], notes: "Keep the story concrete." },
        { title: "Next Step", bullets: ["Review draft", "Add sources", "Publish package"], notes: "End with action." }
      ]
    };
  }

  if (tool === "video") {
    return {
      ...common,
      duration: "30 seconds",
      scenes: [
        { label: "Hook", caption: `Build ${title} from one prompt.`, transition: "Clean cut" },
        { label: "Problem", caption: "Too many tools slow creative work down.", transition: "Slide" },
        { label: "Solution", caption: "Dragonsel creates connected drafts in one workspace.", transition: "Fade" },
        { label: "Export", caption: "Package the result and ship it.", transition: "Push" }
      ]
    };
  }

  if (tool === "website") {
    return {
      ...common,
      brand: title,
      pages: ["Home", "Features", "Workspaces", "Contact"],
      html: `<section><h1>${title}</h1><p>A ${style} website for ${audience} that helps users ${goal}.</p><button>Start creating</button></section>`
    };
  }

  if (tool === "app") {
    return {
      ...common,
      screens: ["Dashboard", "Workspace", "Project Brain", "Export Center"],
      data: ["projects", "assets", "sources", "exports"],
      actions: ["create", "generate", "edit", "download"]
    };
  }

  if (tool === "design") {
    return {
      ...common,
      subtitle: `For ${audience}`,
      colors: ["#1d1d1f", "#0a84ff", "#f5f5f7", "#ffffff"],
      layout: "Premium launch graphic with bold title, quiet support copy, and clean action area"
    };
  }

  if (tool === "export") {
    return {
      ...common,
      manifest: ["research notes", "audio script", "slide outline", "design canvas", "video plan", "website draft", "app map"],
      formats: ["JSON", "HTML", "PNG", "TXT"]
    };
  }

  return {
    ...common,
    summary: `${title} is built for ${audience}. It should ${goal} with a ${style} experience.`,
    keyPoints: [
      "Use one shared project brain for context.",
      "Generate a first version quickly.",
      "Keep every output editable and exportable."
    ],
    questions: [
      "Who is the first user?",
      "What should be generated first?",
      "Which source should guide the result?"
    ]
  };
}

module.exports = function handler(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-store");

  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== "POST") {
    res.statusCode = 405;
    res.end(JSON.stringify({ ok: false, error: "Method not allowed" }));
    return;
  }

  const body = parseBody(req);
  const allowedTools = new Set(["research", "audio", "slides", "design", "video", "website", "app", "export"]);
  const tool = allowedTools.has(body.tool) ? body.tool : "research";
  const prompt = cleanText(body.prompt, "Create a Dragonsel project");

  res.statusCode = 200;
  res.end(JSON.stringify({
    ok: true,
    tool,
    payload: makePayload(tool, prompt, body.project || {})
  }));
};
