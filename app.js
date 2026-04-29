const state = {
  activeTool: "research",
  project: loadProject(),
  currentPayload: null,
  canvas: null,
  isGenerating: false
};

const toolMeta = {
  research: {
    label: "Research Generator",
    title: "Source notes, summary, and questions",
    status: "Research ready",
    pipeline: ["Read prompt", "Use project sources", "Summarize", "Create questions"]
  },
  audio: {
    label: "Audio Overview",
    title: "Two-host script and listening outline",
    status: "Audio ready",
    pipeline: ["Find key ideas", "Write host flow", "Add insights", "Create recap"]
  },
  slides: {
    label: "Slide Builder",
    title: "Editable deck outline and speaker notes",
    status: "Deck ready",
    pipeline: ["Create story arc", "Build slides", "Add notes", "Prepare deck"]
  },
  design: {
    label: "Design Editor",
    title: "Templates, canvas, layers, brand kit",
    status: "Canvas ready",
    pipeline: ["Choose layout", "Build layers", "Apply brand", "Export PNG"]
  },
  video: {
    label: "Video Editor",
    title: "Timeline, scenes, captions, and exports",
    status: "Timeline ready",
    pipeline: ["Write hook", "Create scenes", "Add captions", "Plan exports"]
  },
  website: {
    label: "Website Builder",
    title: "Page sections, code, and preview",
    status: "Website ready",
    pipeline: ["Write copy", "Build sections", "Create preview", "Publish plan"]
  },
  app: {
    label: "App Builder",
    title: "Screens, data model, roles, and actions",
    status: "App ready",
    pipeline: ["Plan screens", "Create data", "Map actions", "Preview app"]
  },
  export: {
    label: "Export Center",
    title: "Project manifest and launch package",
    status: "Export ready",
    pipeline: ["Collect assets", "Create manifest", "Generate links", "Download package"]
  }
};

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  bindUI();
  hydrateProject();
  selectTool("research", false);
});

// Debug API
window.__dragonselDebug = {
  canvasObjectCount: () => state.canvas?.getObjects?.().length ?? 0,
  currentState: () => state,
  exportProject: () => downloadProject()
};

function generateUUID() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback UUID v4 generator
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === "x" ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function bindUI() {
  // Tool tab navigation
  document.querySelectorAll(".tool-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      selectTool(tab.dataset.tool);
      updateTabAccessibility(tab);
    });
  });

  // Navigation links
  document.querySelectorAll("[data-section]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  });

  // Action buttons
  document.getElementById("generateBtn")?.addEventListener("click", () => {
    if (!state.isGenerating) {
      generateActiveTool();
    }
  });
  
  document.getElementById("generateAllBtn")?.addEventListener("click", () => {
    if (!state.isGenerating) {
      generateAllTools();
    }
  });
  
  document.getElementById("clearBtn")?.addEventListener("click", () => {
    document.getElementById("promptInput").value = "";
  });

  document.getElementById("addSourceBtn")?.addEventListener("click", addSource);
  document.getElementById("saveProjectBtn")?.addEventListener("click", saveProjectFromUI);
  document.getElementById("newProjectBtn")?.addEventListener("click", newProject);
  document.getElementById("downloadCurrentBtn")?.addEventListener("click", downloadCurrent);
  document.getElementById("downloadProjectBtn")?.addEventListener("click", downloadProject);

  // Auto-save on input
  ["projectName", "audienceInput", "goalInput", "styleInput"].forEach((id) => {
    document.getElementById(id)?.addEventListener("input", debounce(saveProjectFromUI, 350));
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "s") {
      e.preventDefault();
      saveProjectFromUI();
    }
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (!state.isGenerating) generateActiveTool();
    }
  });
}

function hydrateProject() {
  const projectNameInput = document.getElementById("projectName");
  const audienceInput = document.getElementById("audienceInput");
  const goalInput = document.getElementById("goalInput");
  const styleInput = document.getElementById("styleInput");

  if (projectNameInput) projectNameInput.value = state.project.name;
  if (audienceInput) audienceInput.value = state.project.context.audience;
  if (goalInput) goalInput.value = state.project.context.goal;
  if (styleInput) styleInput.value = state.project.context.style;

  renderSources();
  renderAssets();
}

function loadProject() {
  const saved = localStorage.getItem("dragonsel_studio_project");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      console.warn("Failed to load saved project:", e);
    }
  }
  return {
    name: "Dragonsel Launch System",
    context: {
      audience: "Creators, students, founders",
      goal: "Create everything in one place",
      style: "clean, premium, fast"
    },
    sources: [],
    assets: []
  };
}

function saveProjectFromUI() {
  const projectNameInput = document.getElementById("projectName");
  const audienceInput = document.getElementById("audienceInput");
  const goalInput = document.getElementById("goalInput");
  const styleInput = document.getElementById("styleInput");

  state.project.name = (projectNameInput?.value || "").trim() || "Untitled Project";
  state.project.context.audience = (audienceInput?.value || "").trim();
  state.project.context.goal = (goalInput?.value || "").trim();
  state.project.context.style = (styleInput?.value || "").trim();

  try {
    localStorage.setItem("dragonsel_studio_project", JSON.stringify(state.project));
    setSaveStatus("Saved");
  } catch (e) {
    console.warn("Failed to save project:", e);
    setSaveStatus("Save failed");
  }
  renderAssets();
}

function newProject() {
  if (confirm("Create a new project? Current work won't be saved.")) {
    state.project = {
      name: "Untitled Project",
      context: { audience: "", goal: "", style: "" },
      sources: [],
      assets: []
    };
    state.currentPayload = null;
    hydrateProject();
    document.getElementById("editorBody").innerHTML = `<div class="empty-state"><strong>New project ready.</strong><p>Choose a tool and generate the first artifact.</p></div>`;
    setSaveStatus("New");
  }
}

function setSaveStatus(text) {
  const status = document.getElementById("saveStatus");
  if (!status) return;
  status.textContent = text;
  clearTimeout(setSaveStatus.timer);
  if (text !== "Saved") {
    setSaveStatus.timer = setTimeout(() => {
      status.textContent = "Saved";
    }, 2000);
  }
}

function addSource() {
  const input = document.getElementById("sourceInput");
  const value = (input?.value || "").trim();
  if (!value) {
    alert("Please enter source material.");
    return;
  }
  state.project.sources.push({
    id: generateUUID(),
    title: value.split(/\s+/).slice(0, 6).join(" "),
    content: value,
    createdAt: Date.now()
  });
  if (input) input.value = "";
  saveProjectFromUI();
  renderSources();
  setSaveStatus("Source added");
}

function renderSources() {
  const list = document.getElementById("sourceList");
  if (!list) return;
  list.innerHTML = state.project.sources.map((source) => `
    <div class="source-item">
      <strong>${escapeHTML(source.title)}</strong>
      <span>${escapeHTML(source.content.slice(0, 90))}${source.content.length > 90 ? "..." : ""}</span>
    </div>
  `).join("") || `<div class="source-item"><span>No sources yet.</span></div>`;
}

function renderAssets() {
  const list = document.getElementById("assetList");
  if (!list) return;
  list.innerHTML = state.project.assets.slice(-8).reverse().map((asset) => `
    <div class="asset-item">
      <strong>${escapeHTML(asset.tool)}</strong>
      <span>${escapeHTML(asset.title)}</span>
    </div>
  `).join("") || `<div class="asset-item"><span>No generated assets yet.</span></div>`;
}

function selectTool(tool, openStarter = true) {
  state.activeTool = tool;
  document.querySelectorAll(".tool-tab").forEach((tab) => {
    const isActive = tab.dataset.tool === tool;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", isActive);
  });
  const meta = toolMeta[tool];
  document.getElementById("toolLabel").textContent = meta.label;
  document.getElementById("toolTitle").textContent = meta.title;
  document.getElementById("toolStatus").textContent = "Ready";
  document.getElementById("contextPreview").textContent = contextSentence();
  renderPipeline(meta.pipeline);

  if (tool === "design" && openStarter) {
    renderDesignEditor(makePayload("design"));
  }
}

function updateTabAccessibility(tab) {
  const currentActive = document.querySelector(".tool-tab.active");
  if (currentActive) {
    currentActive.setAttribute("aria-selected", "false");
  }
  tab.setAttribute("aria-selected", "true");
}

function renderPipeline(steps) {
  const pipelineList = document.getElementById("pipelineList");
  if (pipelineList) {
    pipelineList.innerHTML = steps.map((step) => `<span>${escapeHTML(step)}</span>`).join("");
  }
}

function generateActiveTool() {
  state.isGenerating = true;
  updateGenerateButtons(true);
  
  try {
    const payload = makePayload(state.activeTool);
    renderTool(state.activeTool, payload);
    saveAsset(state.activeTool, payload.title, payload);
    setSaveStatus("Generated");
  } catch (e) {
    console.error("Generation failed:", e);
    setSaveStatus("Error generating");
    alert("Failed to generate. Please try again.");
  } finally {
    state.isGenerating = false;
    updateGenerateButtons(false);
  }
}

function generateAllTools() {
  state.isGenerating = true;
  updateGenerateButtons(true);
  
  try {
    ["research", "audio", "slides", "design", "video", "website", "app", "export"].forEach((tool) => {
      const payload = makePayload(tool);
      saveAsset(tool, payload.title, payload);
    });
    selectTool("export", false);
    renderTool("export", makePayload("export"));
    setSaveStatus("Generated all");
  } catch (e) {
    console.error("Generate all failed:", e);
    setSaveStatus("Error generating");
  } finally {
    state.isGenerating = false;
    updateGenerateButtons(false);
  }
}

function updateGenerateButtons(isGenerating) {
  const generateBtn = document.getElementById("generateBtn");
  const generateAllBtn = document.getElementById("generateAllBtn");
  if (generateBtn) {
    generateBtn.disabled = isGenerating;
    generateBtn.textContent = isGenerating ? "Generating..." : "Generate";
  }
  if (generateAllBtn) {
    generateAllBtn.disabled = isGenerating;
    generateAllBtn.textContent = isGenerating ? "Generating..." : "Generate All";
  }
}

function renderTool(tool, payload) {
  state.currentPayload = { tool, payload };
  const meta = toolMeta[tool];
  document.getElementById("toolLabel").textContent = meta.label;
  document.getElementById("toolTitle").textContent = meta.title;
  document.getElementById("toolStatus").textContent = meta.status;
  renderPipeline(meta.pipeline);

  if (tool === "research") return renderResearch(payload);
  if (tool === "audio") return renderAudio(payload);
  if (tool === "slides") return renderSlides(payload);
  if (tool === "design") return renderDesignEditor(payload);
  if (tool === "video") return renderVideo(payload);
  if (tool === "website") return renderWebsite(payload);
  if (tool === "app") return renderApp(payload);
  if (tool === "export") return renderExport(payload);
}

function makePayload(tool) {
  const prompt = (document.getElementById("promptInput")?.value || "").trim() || "Create a Dragonsel project";
  const title = titleFromPrompt(prompt);
  const context = { ...state.project.context };
  const sources = state.project.sources;

  const common = { title, prompt, context, sources, createdAt: new Date().toISOString() };
  
  if (tool === "research") {
    return {
      ...common,
      summary: `${title} is a project for ${context.audience || "a focused audience"} that should ${context.goal || "produce useful creative outputs"}.`,
      keyPoints: [
        "Use one shared project brain for sources, audience, style, and assets.",
        "Generate first drafts quickly, then let the user edit every output.",
        "Keep exports connected so work can move as one package."
      ],
      questions: [
        "Who is the first user?",
        "What output should be generated first?",
        "Which sources or assets should guide the result?"
      ]
    };
  }
  if (tool === "audio") {
    return {
      ...common,
      sections: [
        { host: "A", text: `Today we are unpacking ${title}, why it matters, and what it helps users create.` },
        { host: "B", text: "The big idea is that research, design, video, websites, apps, and exports share one workspace." },
        { host: "A", text: "Instead of jumping tools, the user picks a creation type, describes it, and refines the generated draft." },
        { host: "B", text: "The result is a faster path from idea to usable project package." }
      ]
    };
  }
  if (tool === "slides") {
    return {
      ...common,
      slides: [
        ["Title", title],
        ["Problem", "Creators waste time moving between disconnected apps."],
        ["Solution", "Dragonsel generates connected work from one shared project brain."],
        ["Workflow", "Pick a tool, describe the goal, generate, edit, export."],
        ["Modules", "Research, audio, slides, design, video, website, app, export."],
        ["Next Step", "Start with one prompt and ship the first package."]
      ]
    };
  }
  if (tool === "design") {
    return {
      ...common,
      subtitle: context.goal || "One workspace for everything you create",
      colors: ["#111113", "#b4122d", "#0a84ff", "#f7f6f2"],
      layout: "launch"
    };
  }
  if (tool === "video") {
    return {
      ...common,
      duration: 30,
      scenes: [
        ["0-3s", "Show the problem with bold caption text."],
        ["3-9s", `Reveal ${title} as the solution.`],
        ["9-20s", "Show research, design, video, website, and app outputs."],
        ["20-30s", "End with export package and start free CTA."]
      ],
      captions: ["One idea", "Every tool", "One workspace", "Export together"]
    };
  }
  if (tool === "website") {
    return {
      ...common,
      html: websiteHTML(title, prompt)
    };
  }
  if (tool === "app") {
    return {
      ...common,
      screens: ["Dashboard", "Project Brain", "Generator", "Asset Library", "Export Center"],
      data: ["User", "Project", "Source", "Asset", "Generation Job"],
      actions: ["Generate", "Edit", "Comment", "Save Version", "Publish", "Export"]
    };
  }
  return {
    ...common,
    assets: state.project.assets.map((asset) => `${asset.tool}: ${asset.title}`)
  };
}

function renderResearch(payload) {
  document.getElementById("editorBody").innerHTML = `
    <div class="artifact-grid">
      <article class="artifact-card">
        <strong>Summary</strong>
        <p contenteditable="true">${escapeHTML(payload.summary)}</p>
      </article>
      <article class="artifact-card">
        <strong>Key Points</strong>
        <ul>${payload.keyPoints.map((point) => `<li contenteditable="true">${escapeHTML(point)}</li>`).join("")}</ul>
      </article>
      <article class="artifact-card">
        <strong>Questions</strong>
        <ul>${payload.questions.map((question) => `<li contenteditable="true">${escapeHTML(question)}</li>`).join("")}</ul>
      </article>
      <article class="artifact-card">
        <strong>Sources Used</strong>
        <p>${payload.sources.length || 0} source item(s) connected to the project brain.</p>
      </article>
    </div>
  `;
}

function renderAudio(payload) {
  document.getElementById("editorBody").innerHTML = `
    <textarea class="editor-textarea" contenteditable="false">${payload.sections.map((section) => `Host ${section.host}: ${section.text}`).join("\n\n")}</textarea>
  `;
}

function renderSlides(payload) {
  document.getElementById("editorBody").innerHTML = `
    <div class="slides-grid">
      ${payload.slides.map(([heading, body], index) => `
        <article class="slide-card">
          <strong contenteditable="true">Slide ${index + 1}: ${escapeHTML(heading)}</strong>
          <p contenteditable="true">${escapeHTML(body)}</p>
        </article>
      `).join("")}
    </div>
  `;
}

function renderVideo(payload) {
  document.getElementById("editorBody").innerHTML = `
    <div class="video-editor">
      <div class="timeline">
        ${payload.scenes.map((scene) => `<span>${escapeHTML(scene[0])}</span>`).join("")}
      </div>
      <div class="artifact-grid">
        ${payload.scenes.map((scene, index) => `
          <article class="scene-card">
            <strong>Scene ${index + 1}</strong>
            <p contenteditable="true">${escapeHTML(scene[1])}</p>
          </article>
        `).join("")}
      </div>
      <article class="artifact-card">
        <strong>Captions</strong>
        <p contenteditable="true">${payload.captions.join(" / ")}</p>
      </article>
    </div>
  `;
}

function renderWebsite(payload) {
  document.getElementById("editorBody").innerHTML = `
    <div class="website-editor">
      <textarea class="code-editor" id="websiteCode">${escapeHTML(payload.html)}</textarea>
      <iframe class="preview-frame" id="websitePreview" title="Website preview" sandbox="allow-scripts"></iframe>
    </div>
  `;
  const code = document.getElementById("websiteCode");
  const preview = document.getElementById("websitePreview");
  const update = () => {
    preview.srcdoc = code.value;
    payload.html = code.value;
  };
  code.addEventListener("input", update);
  update();
}

function renderApp(payload) {
  document.getElementById("editorBody").innerHTML = `
    <div class="app-editor">
      <div class="artifact-grid">
        <article class="artifact-card"><strong>Screens</strong><ul>${payload.screens.map((item) => `<li contenteditable="true">${escapeHTML(item)}</li>`).join("")}</ul></article>
        <article class="artifact-card"><strong>Data Model</strong><ul>${payload.data.map((item) => `<li contenteditable="true">${escapeHTML(item)}</li>`).join("")}</ul></article>
        <article class="artifact-card"><strong>Actions</strong><ul>${payload.actions.map((item) => `<li contenteditable="true">${escapeHTML(item)}</li>`).join("")}</ul></article>
      </div>
      <iframe class="preview-frame" title="App preview" sandbox="allow-scripts" srcdoc="${escapeAttr(appHTML(payload))}"></iframe>
    </div>
  `;
}

function renderExport(payload) {
  const manifest = {
    project: state.project.name,
    generatedAt: new Date().toISOString(),
    context: state.project.context,
    sources: state.project.sources.length,
    assets: state.project.assets.map((asset) => ({ tool: asset.tool, title: asset.title }))
  };
  document.getElementById("editorBody").innerHTML = `
    <div class="artifact-grid">
      <article class="artifact-card">
        <strong>Launch Package</strong>
        <ul>${manifest.assets.map((asset) => `<li>${escapeHTML(asset.tool)} - ${escapeHTML(asset.title)}</li>`).join("") || "<li>No assets yet. Generate all first.</li>"}</ul>
      </article>
      <article class="artifact-card">
        <strong>Manifest</strong>
        <textarea class="editor-textarea" contenteditable="false">${JSON.stringify(manifest, null, 2)}</textarea>
      </article>
    </div>
  `;
}

function renderDesignEditor(payload) {
  document.getElementById("editorBody").innerHTML = `
    <div class="design-editor">
      <aside class="design-left">
        <strong>Templates</strong>
        <button class="template-btn active" data-template="launch" type="button">Launch Post</button>
        <button class="template-btn" data-template="thumbnail" type="button">Video Thumbnail</button>
        <button class="template-btn" data-template="slide" type="button">Pitch Slide</button>
        <button class="template-btn" data-template="poster" type="button">Event Poster</button>
        <strong class="eyebrow">Magic Layouts</strong>
        <button class="smart-btn" data-layout="brand" type="button">Brand System</button>
        <button class="smart-btn" data-layout="social" type="button">Social Campaign</button>
        <button class="smart-btn" data-layout="pitch" type="button">Pitch Story</button>
        <button class="smart-btn" data-layout="promo" type="button">Promo Thumbnail</button>
        <strong class="eyebrow">Brand Kit</strong>
        <div class="brand-swatches">
          ${payload.colors.map((color) => `<button data-color="${color}" style="background:${color}" type="button" aria-label="Color ${color}"></button>`).join("")}
        </div>
        <textarea class="design-prompt" id="designPrompt">${escapeHTML(JSON.stringify(payload, null, 2))}</textarea>
        <button class="primary-btn full" id="applyDesignBtn" type="button">Generate Layout</button>
      </aside>
      <section class="design-center">
        <div class="design-toolbar">
          <button id="addTextBtn" type="button">Text</button>
          <button id="addHeadingBtn" type="button">Heading</button>
          <button id="addBoxBtn" type="button">Box</button>
          <button id="addCircleBtn" type="button">Circle</button>
          <label class="design-upload">Image <input id="imageUpload" type="file" accept="image/*"></label>
          <label>Color <input id="designColor" type="color" value="${payload.colors[1]}"></label>
          <label>Size <input id="designSize" type="number" min="10" max="120" value="42"></label>
          <input class="text-control" id="designText" type="text" value="${escapeAttr(payload.title)}">
          <button id="frontBtn" type="button">Front</button>
          <button id="backBtn" type="button">Back</button>
          <button id="deleteBtn" type="button">Delete</button>
          <button id="exportPngBtn" type="button">PNG</button>
        </div>
        <div class="canvas-stage">
          <canvas id="designCanvas" width="960" height="540"></canvas>
        </div>
      </section>
      <aside class="design-right">
        <strong>Layers</strong>
        <div class="layer-list" id="layerList"></div>
        <div class="selected-meta" id="selectedMeta">Select a layer to edit it.</div>
      </aside>
    </div>
  `;
  setTimeout(() => initCanvas(payload), 40);
}

function initCanvas(payload) {
  if (!window.fabric) {
    document.querySelector(".canvas-stage").innerHTML = `<div class="artifact-card"><strong>Canvas unavailable</strong><p>Fabric failed to load. Check internet and refresh.</p></div>`;
    return;
  }

  state.canvas = new fabric.Canvas("designCanvas", {
    backgroundColor: payload.colors[3] || "#f7f6f2",
    preserveObjectStacking: true
  });

  bindCanvasControls();
  applyCanvasTemplate(payload.layout || "launch", payload);
  state.canvas.on("selection:created", syncLayerPanel);
  state.canvas.on("selection:updated", syncLayerPanel);
  state.canvas.on("selection:cleared", syncLayerPanel);
  state.canvas.on("object:added", syncLayerPanel);
  state.canvas.on("object:removed", syncLayerPanel);
  state.canvas.on("object:modified", syncLayerPanel);
}

function bindCanvasControls() {
  document.querySelectorAll(".template-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".template-btn").forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");
      applyCanvasTemplate(btn.dataset.template, getDesignPayloadFromInput());
    });
  });
  document.querySelectorAll(".smart-btn").forEach((btn) => btn.addEventListener("click", () => applySmartLayout(btn.dataset.layout)));
  document.querySelectorAll(".brand-swatches button").forEach((btn) => btn.addEventListener("click", () => setActiveFill(btn.dataset.color)));
  document.getElementById("applyDesignBtn").addEventListener("click", () => applyCanvasTemplate(document.querySelector(".template-btn.active")?.dataset.template || "launch", getDesignPayloadFromInput()));
  document.getElementById("addTextBtn").addEventListener("click", () => addCanvasText("Dragonsel", 34));
  document.getElementById("addHeadingBtn").addEventListener("click", () => addCanvasText("Big Idea", 64, true));
  document.getElementById("addBoxBtn").addEventListener("click", () => addCanvasShape("rect"));
  document.getElementById("addCircleBtn").addEventListener("click", () => addCanvasShape("circle"));
  document.getElementById("frontBtn").addEventListener("click", () => moveActive("front"));
  document.getElementById("backBtn").addEventListener("click", () => moveActive("back"));
  document.getElementById("deleteBtn").addEventListener("click", deleteActive);
  document.getElementById("exportPngBtn").addEventListener("click", exportCanvasPng);
  document.getElementById("designColor").addEventListener("input", (event) => setActiveFill(event.target.value));
  document.getElementById("designSize").addEventListener("input", (event) => {
    const active = state.canvas.getActiveObject();
    if (active && active.fontSize) active.set("fontSize", Number(event.target.value));
    state.canvas.requestRenderAll();
    syncLayerPanel();
  });
  document.getElementById("designText").addEventListener("input", (event) => {
    const active = state.canvas.getActiveObject();
    if (active && "text" in active) active.set("text", event.target.value);
    state.canvas.requestRenderAll();
    syncLayerPanel();
  });
  document.getElementById("imageUpload").addEventListener("change", handleImageUpload);
}

function getDesignPayloadFromInput() {
  try {
    return JSON.parse(document.getElementById("designPrompt").value);
  } catch {
    return makePayload("design");
  }
}

function applyCanvasTemplate(template, payload) {
  const canvas = state.canvas;
  if (!canvas) return;
  canvas.clear();
  const colors = payload.colors || ["#111113", "#b4122d", "#0a84ff", "#f7f6f2"];
  const title = payload.title || "Dragonsel";
  const subtitle = payload.subtitle || payload.context?.goal || "One workspace for everything you create";
  addRect(0, 0, 960, 540, colors[3] || "#f7f6f2", "Background", false);

  if (template === "thumbnail") {
    addRect(0, 0, 960, 540, colors[0], "Dark background", false);
    addCircle(682, 92, 128, colors[1], "Focus circle");
    addCanvasText(title.toUpperCase(), 58, 72, 72, "#ffffff", 560, "Headline");
    addCanvasText("Made in Dragonsel", 64, 404, 34, "#ffffff", 430, "Caption");
  } else if (template === "slide") {
    addRect(48, 44, 864, 452, "#ffffff", "Slide surface");
    addRect(48, 44, 16, 452, colors[1], "Accent bar");
    addCanvasText(title, 94, 94, 56, colors[0], 690, "Headline");
    addCanvasText(subtitle, 98, 268, 28, "#696966", 680, "Subtitle");
  } else if (template === "poster") {
    addRect(0, 0, 960, 540, colors[0], "Poster background", false);
    addRect(70, 68, 820, 405, "#ffffff", "Poster card");
    addCanvasText(title, 104, 104, 62, colors[0], 700, "Headline");
    addCanvasText(subtitle, 108, 318, 30, colors[1], 690, "Subtitle");
  } else {
    addRect(0, 0, 960, 540, colors[0], "Launch background", false);
    addRect(600, 0, 360, 540, colors[1], "Color panel");
    addCircle(690, 100, 90, colors[2], "Accent circle");
    addCanvasText(title, 58, 78, 66, "#ffffff", 540, "Headline");
    addCanvasText(subtitle, 62, 345, 30, "rgba(255,255,255,0.78)", 520, "Subtitle");
    addCanvasText("Dragonsel", 730, 428, 30, "#ffffff", 190, "Brand");
  }
  canvas.requestRenderAll();
  syncLayerPanel();
}

function applySmartLayout(layout) {
  const payload = getDesignPayloadFromInput();
  payload.layout = layout === "promo" ? "thumbnail" : layout === "pitch" ? "slide" : "launch";
  applyCanvasTemplate(payload.layout, payload);
  if (layout === "brand") {
    const colors = payload.colors || ["#111113", "#b4122d", "#0a84ff", "#f7f6f2"];
    colors.slice(0, 4).forEach((color, index) => addRect(90 + index * 112, 370, 82, 82, color, `Brand color ${index + 1}`));
  }
  if (layout === "social") {
    addRect(650, 90, 170, 170, payload.colors?.[2] || "#0a84ff", "Social media block");
    addCanvasText("Share today", 650, 300, 30, "#ffffff", 200, "Social CTA");
  }
  state.canvas.requestRenderAll();
  syncLayerPanel();
}

function addRect(left, top, width, height, fill, name, selectable = true) {
  const rect = new fabric.Rect({ left, top, width, height, rx: 16, ry: 16, fill, name, selectable, evented: selectable });
  state.canvas.add(rect);
  return rect;
}

function addCircle(left, top, radius, fill, name) {
  const circle = new fabric.Circle({ left, top, radius, fill, opacity: 0.9, name });
  state.canvas.add(circle);
  return circle;
}

function addCanvasText(text, left = 120, top = 170, size = 34, fill = "#111113", width = 420, name = "Text") {
  const obj = new fabric.Textbox(text, {
    left, top, width, fill, fontSize: size, fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", fontWeight: size > 44 ? 900 : 750, lineHeight: 0.96, name
  });
  state.canvas.add(obj);
  state.canvas.setActiveObject(obj);
  state.canvas.requestRenderAll();
  syncLayerPanel();
}

function addCanvasShape(type) {
  const fill = document.getElementById("designColor").value || "#b4122d";
  if (type === "circle") addCircle(370, 160, 74, fill, "Circle");
  else addRect(330, 170, 220, 120, fill, "Box");
  state.canvas.setActiveObject(state.canvas.getObjects().at(-1));
  state.canvas.requestRenderAll();
  syncLayerPanel();
}

function setActiveFill(color) {
  const active = state.canvas?.getActiveObject();
  if (!active) return;
  active.set("fill", color);
  document.getElementById("designColor").value = color;
  state.canvas.requestRenderAll();
  syncLayerPanel();
}

function moveActive(direction) {
  const active = state.canvas?.getActiveObject();
  if (!active) return;
  if (direction === "front") state.canvas.bringObjectToFront(active);
  else state.canvas.sendObjectToBack(active);
  state.canvas.requestRenderAll();
  syncLayerPanel();
}

function deleteActive() {
  const active = state.canvas?.getActiveObject();
  if (!active) return;
  state.canvas.remove(active);
  state.canvas.requestRenderAll();
  syncLayerPanel();
}

function handleImageUpload(event) {
  const file = event.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    const placeImage = (img) => {
      img.scaleToWidth(280);
      img.set({ left: 330, top: 140, name: file.name });
      state.canvas.add(img);
      state.canvas.setActiveObject(img);
      state.canvas.requestRenderAll();
      syncLayerPanel();
    };
    const maybeImage = fabric.Image.fromURL(reader.result, placeImage);
    if (maybeImage?.then) maybeImage.then(placeImage);
  };
  reader.readAsDataURL(file);
  event.target.value = "";
}

function syncLayerPanel() {
  const canvas = state.canvas;
  const list = document.getElementById("layerList");
  const meta = document.getElementById("selectedMeta");
  if (!canvas || !list) return;
  const objects = canvas.getObjects().filter((obj) => obj.selectable !== false);
  list.innerHTML = objects.slice().reverse().map((obj, reversedIndex) => {
    const originalIndex = objects.length - 1 - reversedIndex;
    const name = obj.name || obj.text || obj.type;
    return `<button type="button" data-index="${originalIndex}" title="${escapeHTML(String(name))}">${escapeHTML(String(name).slice(0, 32))}</button>`;
  }).join("");
  list.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const obj = objects[Number(btn.dataset.index)];
      if (!obj) return;
      canvas.setActiveObject(obj);
      canvas.requestRenderAll();
      syncLayerPanel();
    });
  });
  const active = canvas.getActiveObject();
  if (meta) meta.textContent = active ? `${active.name || active.type} - x:${Math.round(active.left || 0)}, y:${Math.round(active.top || 0)}` : "Select a layer to edit it.";
  if (active) {
    if (active.fontSize) document.getElementById("designSize").value = active.fontSize;
    if ("text" in active) document.getElementById("designText").value = active.text;
    if (typeof active.fill === "string" && active.fill.startsWith("#")) document.getElementById("designColor").value = active.fill;
  }
}

function exportCanvasPng() {
  const canvas = state.canvas;
  if (!canvas) return;
  const dataUrl = canvas.toDataURL({ format: "png", multiplier: 2 });
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = `${safeFileName(state.project.name)}-design.png`;
  a.click();
}

function saveAsset(tool, title, payload) {
  const asset = {
    id: generateUUID(),
    tool,
    title,
    payload,
    createdAt: Date.now()
  };
  state.project.assets.push(asset);
  if (state.project.assets.length > 80) state.project.assets.shift();
  saveProjectFromUI();
  renderAssets();
}

function downloadCurrent() {
  if (state.activeTool === "design" && state.canvas) return exportCanvasPng();
  if (!state.currentPayload) {
    alert("Nothing to download. Generate some content first.");
    return;
  }
  downloadBlob(`${safeFileName(state.currentPayload.payload.title)}-${state.activeTool}.json`, JSON.stringify(state.currentPayload.payload, null, 2), "application/json");
}

function downloadProject() {
  downloadBlob(`${safeFileName(state.project.name)}-dragonsel-project.json`, JSON.stringify(state.project, null, 2), "application/json");
}

function websiteHTML(title, prompt) {
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
body{margin:0;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;color:#111;background:#f7f6f2}
header{padding:56px 7vw;background:#111;color:white}
h1{font-size:clamp(42px,8vw,86px);line-height:.95;margin:0 0 18px}
p{font-size:18px;line-height:1.55;color:#696966}
header p{color:rgba(255,255,255,.72);max-width:720px}
section{padding:44px 7vw}
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.card{padding:22px;border:1px solid #ddd;border-radius:14px;background:white}
a{display:inline-flex;margin-top:20px;padding:13px 18px;border-radius:10px;background:#b4122d;color:white;text-decoration:none;font-weight:800;cursor:pointer}
a:hover{transform:translateY(-2px);box-shadow:0 8px 20px rgba(180,18,45,.2)}
@media(max-width:800px){.grid{grid-template-columns:1fr}}
</style>
</head>
<body>
<header><h1>${escapeHTML(title)}</h1><p>${escapeHTML(prompt)}</p><a href="javascript:void(0)">Start creating</a></header>
<section><h2>Everything connected</h2><div class="grid"><div class="card">Research</div><div class="card">Design</div><div class="card">Video</div><div class="card">Website</div><div class="card">Apps</div><div class="card">Export</div></div></section>
<section><a href="javascript:void(0)">Get started free</a></section>
</body>
</html>`;
}

function appHTML(payload) {
  return `<!doctype html><html><body style="margin:0;font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;background:#f5f5f2;color:#111">
<main style="padding:24px">
<h1 style="margin:0 0 20px">${escapeHTML(payload.title)}</h1>
<section style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
${payload.screens.map((screen) => `<article style="padding:18px;border-radius:12px;background:white;border:1px solid #ddd"><strong>${escapeHTML(screen)}</strong><p style="color:#696966;margin:8px 0 0">Generated screen preview</p></article>`).join("")}
</section>
</main></body></html>`;
}

function titleFromPrompt(prompt) {
  return prompt.replace(/^(create|build|make|generate|design)\s+/i, "").replace(/[^\w\s-]/g, "").trim().split(/\s+/).slice(0, 6).join(" ") || "Dragonsel Project";
}

function contextSentence() {
  const context = state.project.context;
  return `Audience: ${context.audience || "not set"}. Goal: ${context.goal || "not set"}. Style: ${context.style || "not set"}.`;
}

function downloadBlob(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function safeFileName(value) {
  return String(value || "dragonsel").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function escapeHTML(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(value) {
  return escapeHTML(value).replace(/\n/g, "&#10;");
}

function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
