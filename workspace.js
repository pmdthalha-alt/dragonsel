/**
 * Dragonsel Unified Workspace
 * Connects all modules through ProjectBrain
 * "Pick + Describe" workflow with editable outputs
 */

class WorkspaceManager {
  constructor() {
    this.brain = ProjectBrain.currentProject();
    this.currentMode = 'slides';
    this.currentEditor = null;
    this.isGenerating = false;
    
    this.init();
  }

  init() {
    // No need to create UI - it's already in index.html
    this.setupModePicker();
    this.setupBrainPanel();
    this.setupGenerateButton();
    this.setupProjectManagement();
    
    // Load existing project data into UI
    this.refreshBrainUI();
  }

  // ==================== MODE PICKER ====================
  
  setupModePicker() {
    const picker = document.getElementById('modePicker');
    if (!picker) return;
    
    picker.addEventListener('click', (e) => {
      const btn = e.target.closest('.mode-btn');
      if (!btn) return;
      
      // Update active state
      picker.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      // Set mode
      this.currentMode = btn.dataset.mode;
      
      // Update prompt placeholder
      const promptInput = document.getElementById('workspacePrompt');
      if (promptInput) {
        promptInput.value = this._getDefaultPrompt(this.currentMode);
      }
      
      // Show appropriate editor if asset exists, otherwise open usable starter tools.
      const loaded = this.loadLatestAssetForMode(this.currentMode);
      if (!loaded && this.currentMode === 'design') {
        this.showDesignEditor(document.getElementById('editorArea'), JSON.stringify({
          title: 'Dragonsel Launch',
          subtitle: 'One workspace for everything you create',
          colors: ['#111111', '#b4122d', '#0a84ff', '#f7f6f2'],
          layout: 'launch'
        }, null, 2));
      }
    });
  }

  _getDefaultPrompt(mode) {
    const prompts = {
      research: 'Create a research summary about Dragonsel AI workspace like NotebookLM, covering features, benefits, and use cases.',
      audio: 'Create a podcast-style audio overview script for Dragonsel, explaining how it combines research, slides, design, video, and web building.',
      slides: 'Create a slide deck about Dragonsel AI workspace like NotebookLM, with 8 slides covering features and benefits.',
      design: 'Create a brand kit for Dragonsel with colors, logo concepts, and social media assets.',
      video: 'Create a 30-second promo video timeline for Dragonsel with scenes, captions, and transitions.',
      website: 'Create a landing page for Dragonsel AI workspace with hero, features, and CTA sections.',
      app: 'Create a dashboard app for Dragonsel with project list, asset library, and generation tools.',
      export: 'Create an export package manifest for Dragonsel project with all assets and files.'
    };
    return prompts[mode] || prompts.slides;
  }

  // ==================== BRAIN PANEL ====================
  
  setupBrainPanel() {
    // Add source button
    const addSourceBtn = document.getElementById('addSourceBtn');
    addSourceBtn?.addEventListener('click', () => this.showAddSourceDialog());
    
    // Context fields
    ['ctxAudience', 'ctxGoal', 'ctxStyle'].forEach(id => {
      const el = document.getElementById(id);
      el?.addEventListener('input', () => {
        const field = id.replace('ctx', '').toLowerCase();
        this.brain.context[field] = el.value;
        this.debouncedSave();
      });
    });
    
    // Project name
    const nameEl = document.getElementById('projectName');
    nameEl?.addEventListener('input', () => {
      this.brain.name = nameEl.textContent.trim() || 'Untitled Project';
      this.debouncedSave();
    });
  }

  showAddSourceDialog() {
    const type = prompt('Source type?\n(file/url/text)', 'text');
    if (!type) return;
    
    let title, content;
    if (type === 'url') {
      title = prompt('Source title?', 'Web Page');
      content = prompt('Enter URL:', 'https://example.com');
    } else if (type === 'file') {
      title = prompt('Source title?', 'Document');
      content = prompt('Paste file content or summary:', '');
    } else {
      title = prompt('Source title?', 'Note');
      content = prompt('Enter text:', '');
    }
    
    if (title && content) {
      this.brain.addSource(type, title, content);
      this.brain.save();
      this.refreshBrainUI();
    }
  }

  refreshBrainUI() {
    // Source list
    const sourceList = document.getElementById('sourceList');
    if (sourceList) {
      sourceList.innerHTML = this.brain.sources.map(s => 
        `<div class="source-item" data-id="${s.id}">
          <span class="source-type">${s.type}</span>
          <span class="source-title">${s.title}</span>
          <button class="remove-btn" onclick="workspace.removeSource('${s.id}')">×</button>
        </div>`
      ).join('');
    }
    
    // Asset list
    const assetList = document.getElementById('assetList');
    if (assetList) {
      assetList.innerHTML = this.brain.assets.slice(-10).reverse().map(a => 
        `<div class="asset-item" data-module="${a.module}">
          <span class="asset-module">${a.module}</span>
          <span class="asset-name">${a.name}</span>
        </div>`
      ).join('');
    }
    
    // History list
    const historyList = document.getElementById('historyList');
    if (historyList) {
      historyList.innerHTML = this.brain.history.slice(-10).reverse().map(h => 
        `<div class="history-item">
          <span class="history-module">${h.module}</span>
          <span class="history-prompt">${h.prompt.slice(0, 50)}...</span>
        </div>`
      ).join('');
    }
    
    // Update project name in bar
    const nameBar = document.getElementById('projectNameBar');
    if (nameBar) nameBar.textContent = this.brain.name;
  }

  removeSource(sourceId) {
    this.brain.sources = this.brain.sources.filter(s => s.id !== sourceId);
    this.brain.save();
    this.refreshBrainUI();
  }

  // ==================== GENERATION ====================
  
  setupGenerateButton() {
    const genBtn = document.getElementById('generateBtn');
    genBtn?.addEventListener('click', () => this.generate());
    
    const genAllBtn = document.getElementById('generateAllBtn');
    genAllBtn?.addEventListener('click', () => this.generateAll());
    
    const clearBtn = document.getElementById('clearPromptBtn');
    clearBtn?.addEventListener('click', () => {
      const promptInput = document.getElementById('workspacePrompt');
      if (promptInput) promptInput.value = '';
    });
  }

  async generate() {
    if (this.isGenerating) return;
    
    const promptInput = document.getElementById('workspacePrompt');
    const prompt = promptInput?.value.trim();
    if (!prompt) {
      alert('Please describe what you want to create.');
      return;
    }
    
    this.isGenerating = true;
    const editorArea = document.getElementById('editorArea');
    editorArea.innerHTML = '<div class="generating">⚡ Generating with AI...</div>';
    
    try {
      // Check API key
      if (!window.DragonselAI?.API_KEY) {
        const key = prompt('Enter your Groq API key (free from console.groq.com):', localStorage.getItem('dragonsel_api_key') || '');
        if (key) {
          window.DragonselAI.initAI(key);
        } else {
          throw new Error('API key required');
        }
      }
      
      // Generate with context
      const context = this.brain.getContextForPrompt();
      const fullPrompt = `${prompt}\n\nContext:${context}`;
      
      const result = await window.DragonselAI.generate(this.currentMode, fullPrompt);
      
      // Save to brain
      this.brain.addAsset(this.currentMode, prompt.slice(0, 50), result);
      this.brain.save();
      
      // Show in editor
      this.showInEditor(this.currentMode, result);
      
      // Refresh UI
      this.refreshBrainUI();
      
    } catch (error) {
      editorArea.innerHTML = `<div class="error">Error: ${error.message}</div>`;
    } finally {
      this.isGenerating = false;
    }
  }

  async generateAll() {
    if (this.isGenerating) return;
    const promptInput = document.getElementById('workspacePrompt');
    const basePrompt = promptInput?.value.trim() || 'Create a complete Dragonsel launch package';
    
    this.isGenerating = true;
    const editorArea = document.getElementById('editorArea');
    editorArea.innerHTML = '<div class="generating">🚀 Generating all modules...<br><small>This may take a minute...</small></div>';
    
    const modes = ['research', 'slides', 'design', 'video', 'website', 'app'];
    const context = this.brain.getContextForPrompt();
    
    for (const mode of modes) {
      try {
        const prompt = `${basePrompt} (${mode} version)`;
        const result = await window.DragonselAI.generate(mode, `${prompt}\n\nContext:${context}`);
        this.brain.addAsset(mode, `${basePrompt.slice(0, 30)} (${mode})`, result);
      } catch (e) {
        console.error(`Failed ${mode}:`, e);
      }
    }
    
    this.brain.save();
    this.isGenerating = false;
    
    // Show research result by default
    this.loadLatestAssetForMode('research');
    this.refreshBrainUI();
  }

  // ==================== EDITOR ====================
  
  showInEditor(mode, content) {
    const editorArea = document.getElementById('editorArea');
    if (!editorArea) return;
    
    switch (mode) {
      case 'slides':
        this.showSlidesEditor(editorArea, content);
        break;
      case 'design':
        this.showDesignEditor(editorArea, content);
        break;
      case 'video':
        this.showVideoEditor(editorArea, content);
        break;
      case 'website':
        this.showWebsiteEditor(editorArea, content);
        break;
      case 'research':
      case 'audio':
        this.showTextEditor(editorArea, content, mode);
        break;
      case 'app':
        this.showAppEditor(editorArea, content);
        break;
      case 'export':
        this.showExportView(editorArea, content);
        break;
    }
  }

  showSlidesEditor(container, content) {
    try {
      const data = JSON.parse(content);
      const html = window.DragonselAI.renderSlides(content);
      container.innerHTML = `
        <div class="editor-header">
          <strong>Slides Editor</strong>
          <div class="editor-actions">
            <button onclick="workspace.downloadCurrent()">📥 Download</button>
            <button onclick="workspace.editSlidesRaw()">✏️ Edit JSON</button>
          </div>
        </div>
        <div class="slides-preview">
          <iframe srcdoc="${html.replace(/"/g, '&quot;')}" style="width:100%;height:500px;border-radius:8px;border:1px solid var(--line);"></iframe>
        </div>
        <div class="slides-outline">
          <strong>Outline:</strong>
          <ol>
            ${data.slides?.map((s, i) => `<li>${s.h}</li>`).join('') || '<li>No slides</li>'}
          </ol>
        </div>
      `;
    } catch {
      this.showTextEditor(container, content, 'slides');
    }
  }

  showDesignEditor(container, content) {
    const safeContent = this.escapeHTML(content || '');
    container.innerHTML = `
      <div class="design-editor-wrapper">
        <!-- Top Toolbar -->
        <div class="design-top-bar">
          <div class="design-top-left">
            <button onclick="workspace.designGoBack()" class="design-icon-btn" title="Back">←</button>
            <span class="design-file-name">${this.brain.name || 'Untitled Design'}</span>
            <span class="design-save-status" id="designSaveStatus">Saved</span>
          </div>
          <div class="design-top-center">
            <button id="designUndo" class="design-icon-btn" title="Undo (Ctrl+Z)">↩</button>
            <button id="designRedo" class="design-icon-btn" title="Redo (Ctrl+Y)">↪</button>
            <div class="design-separator"></div>
            <button id="designZoomOut" class="design-icon-btn" title="Zoom Out">−</button>
            <span id="designZoomLevel" class="design-zoom-display">100%</span>
            <button id="designZoomIn" class="design-icon-btn" title="Zoom In">+</button>
            <button id="designZoomFit" class="design-icon-btn" title="Fit to Screen">⊞</button>
          </div>
          <div class="design-top-right">
            <button onclick="workspace.saveDesignToBrain()" class="design-btn-secondary">Save</button>
            <button onclick="workspace.exportDesignPng()" class="design-btn-primary">Export PNG</button>
            <button onclick="workspace.exportDesignSvg()" class="design-btn-secondary">SVG</button>
            <button onclick="workspace.exportDesignPdf()" class="design-btn-secondary">PDF</button>
          </div>
        </div>

        <div class="design-studio">
          <!-- Left Sidebar -->
          <aside class="design-left-panel">
            <div class="design-sidebar-tabs">
              <button class="sidebar-tab active" data-panel="templates">Templates</button>
              <button class="sidebar-tab" data-panel="elements">Elements</button>
              <button class="sidebar-tab" data-panel="text">Text</button>
              <button class="sidebar-tab" data-panel="uploads">Uploads</button>
              <button class="sidebar-tab" data-panel="brand">Brand</button>
            </div>

            <div class="design-sidebar-content">
              <!-- Templates Panel -->
              <div class="sidebar-panel active" id="panel-templates">
                <div class="sidebar-search">
                  <input type="text" placeholder="Search templates..." id="templateSearch">
                </div>
                <div class="template-grid">
                  <button class="template-card" data-template="launch">
                    <div class="template-preview launch-preview"></div>
                    <span>Launch Post</span>
                  </button>
                  <button class="template-card" data-template="thumbnail">
                    <div class="template-preview thumb-preview"></div>
                    <span>Thumbnail</span>
                  </button>
                  <button class="template-card" data-template="slide">
                    <div class="template-preview slide-preview"></div>
                    <span>Pitch Slide</span>
                  </button>
                  <button class="template-card" data-template="poster">
                    <div class="template-preview poster-preview"></div>
                    <span>Poster</span>
                  </button>
                  <button class="template-card" data-template="instagram">
                    <div class="template-preview insta-preview"></div>
                    <span>Instagram Post</span>
                  </button>
                  <button class="template-card" data-template="story">
                    <div class="template-preview story-preview"></div>
                    <span>Story</span>
                  </button>
                  <button class="template-card" data-template="youtube">
                    <div class="template-preview yt-preview"></div>
                    <span>YouTube Cover</span>
                  </button>
                  <button class="template-card" data-template="business">
                    <div class="template-preview biz-preview"></div>
                    <span>Business Card</span>
                  </button>
                </div>
                <strong class="editor-label">AI Magic</strong>
                <button class="design-smart-btn" data-smart-layout="brand">Brand Kit</button>
                <button class="design-smart-btn" data-smart-layout="social">Social Pack</button>
                <button class="design-smart-btn" data-smart-layout="pitch">Pitch Deck</button>
                <button class="design-smart-btn" data-smart-layout="promo">Ad Campaign</button>
              </div>

              <!-- Elements Panel -->
              <div class="sidebar-panel" id="panel-elements">
                <div class="sidebar-search">
                  <input type="text" placeholder="Search elements...">
                </div>
                <strong>Shapes</strong>
                <div class="element-grid">
                  <button class="element-btn" data-shape="rect">□ Rectangle</button>
                  <button class="element-btn" data-shape="circle">○ Circle</button>
                  <button class="element-btn" data-shape="triangle">△ Triangle</button>
                  <button class="element-btn" data-shape="line">━ Line</button>
                  <button class="element-btn" data-shape="arrow">→ Arrow</button>
                  <button class="element-btn" data-shape="star">☆ Star</button>
                  <button class="element-btn" data-shape="polygon">⬠ Polygon</button>
                  <button class="element-btn" data-shape="ellipse">○ Ellipse</button>
                </div>
                <strong>Lines & Connectors</strong>
                <div class="element-grid">
                  <button class="element-btn" data-shape="hline">─ Horizontal</button>
                  <button class="element-btn" data-shape="vline">│ Vertical</button>
                  <button class="element-btn" data-shape="brace">{ Brace</button>
                </div>
              </div>

              <!-- Text Panel -->
              <div class="sidebar-panel" id="panel-text">
                <strong>Add Text</strong>
                <button class="text-style-btn" data-text-type="heading">Add Heading</button>
                <button class="text-style-btn" data-text-type="subheading">Add Subheading</button>
                <button class="text-style-btn" data-text-type="body">Add Body Text</button>
                <button class="text-style-btn" data-text-type="caption">Add Caption</button>
                <div class="text-divider"></div>
                <strong>Font Family</strong>
                <select id="designFontFamily" class="design-select">
                  <option value="Inter, Arial, sans-serif">Inter</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Courier New', monospace">Courier New</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option value="Impact, sans-serif">Impact</option>
                  <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                </select>
                <strong>Font Size</strong>
                <input id="designFontSize" type="number" min="8" max="400" value="42" class="design-input">
                <strong>Text Align</strong>
                <div class="align-group">
                  <button class="align-btn active" data-align="left">Left</button>
                  <button class="align-btn" data-align="center">Center</button>
                  <button class="align-btn" data-align="right">Right</button>
                </div>
                <strong>Font Weight</strong>
                <div class="weight-group">
                  <button class="weight-btn" data-weight="400">Regular</button>
                  <button class="weight-btn active" data-weight="700">Bold</button>
                  <button class="weight-btn" data-weight="900">Black</button>
                </div>
                <strong>Font Style</strong>
                <div class="style-group">
                  <button id="designItalic" class="style-btn" data-style="italic">I</button>
                  <button id="designUnderline" class="style-btn" data-style="underline">U</button>
                  <button id="designStrike" class="style-btn" data-style="line-through">S</button>
                </div>
              </div>

              <!-- Uploads Panel -->
              <div class="sidebar-panel" id="panel-uploads">
                <label class="upload-area" id="designUploadArea">
                  <input id="designImageUpload" type="file" accept="image/*" multiple>
                  <div class="upload-placeholder">
                    <span>📁</span>
                    <p>Click or drop images here</p>
                  </div>
                </label>
                <div class="uploaded-images" id="uploadedImages"></div>
              </div>

              <!-- Brand Panel -->
              <div class="sidebar-panel" id="panel-brand">
                <strong>Brand Colors</strong>
                <div class="brand-kit-row">
                  <button class="brand-swatch-lg" data-brand="#111111" style="background:#111111" title="#111111"></button>
                  <button class="brand-swatch-lg" data-brand="#b4122d" style="background:#b4122d" title="#b4122d"></button>
                  <button class="brand-swatch-lg" data-brand="#0a84ff" style="background:#0a84ff" title="#0a84ff"></button>
                  <button class="brand-swatch-lg" data-brand="#16835f" style="background:#16835f" title="#16835f"></button>
                  <button class="brand-swatch-lg" data-brand="#c98222" style="background:#c98222" title="#c98222"></button>
                  <button class="brand-swatch-lg" data-brand="#8e44ad" style="background:#8e44ad" title="#8e44ad"></button>
                  <button class="brand-swatch-lg" data-brand="#e74c3c" style="background:#e74c3c" title="#e74c3c"></button>
                  <button class="brand-swatch-lg" data-brand="#3498db" style="background:#3498db" title="#3498db"></button>
                </div>
                <button class="brand-swatch-add" id="addBrandColor">+ Add Color</button>
                <strong>Brand Fonts</strong>
                <div class="brand-font-list" id="brandFontList">
                  <div class="brand-font-item">Inter, Arial, sans-serif</div>
                  <div class="brand-font-item">Georgia, serif</div>
                </div>
                <strong>Brand Logo</strong>
                <div class="brand-logo-area" id="brandLogoArea">No logo uploaded</div>
                <button onclick="workspace.setBrandFromDesign()" class="design-smart-btn">Extract from Design</button>
              </div>
            </div>
          </aside>

          <!-- Center Canvas Area -->
          <section class="design-center-panel">
            <div class="canvas-toolbar">
              <div class="toolbar-group">
                <button id="designAddText" class="toolbar-btn" title="Add Text">T</button>
                <button id="designAddHeading" class="toolbar-btn" title="Add Heading">H</button>
                <button id="designAddRect" class="toolbar-btn" title="Rectangle">□</button>
                <button id="designAddCircle" class="toolbar-btn" title="Circle">○</button>
                <button id="designAddTriangle" class="toolbar-btn" title="Triangle">△</button>
                <button id="designAddLine" class="toolbar-btn" title="Line">━</button>
              </div>
              <div class="toolbar-separator"></div>
              <div class="toolbar-group">
                <button id="designDuplicate" class="toolbar-btn" title="Duplicate (Ctrl+D)">⧉</button>
                <button id="designGroup" class="toolbar-btn" title="Group (Ctrl+G)">⊞+</button>
                <button id="designUngroup" class="toolbar-btn" title="Ungroup (Ctrl+Shift+G)">⊞-</button>
              </div>
              <div class="toolbar-separator"></div>
              <div class="toolbar-group">
                <button id="designBringFront" class="toolbar-btn" title="Bring to Front">↑</button>
                <button id="designSendBack" class="toolbar-btn" title="Send to Back">↓</button>
                <button id="designFlipH" class="toolbar-btn" title="Flip Horizontal">↔</button>
                <button id="designFlipV" class="toolbar-btn" title="Flip Vertical">↕</button>
              </div>
              <div class="toolbar-separator"></div>
              <div class="toolbar-group">
                <input id="designColor" type="color" value="#b4122d" title="Fill Color" class="color-picker-mini">
                <input id="designStrokeColor" type="color" value="#000000" title="Stroke Color" class="color-picker-mini">
                <input id="designStrokeWidth" type="number" min="0" max="20" value="0" title="Stroke Width" class="stroke-input">
              </div>
              <div class="toolbar-separator"></div>
              <div class="toolbar-group">
                <button id="designDelete" class="toolbar-btn toolbar-btn-danger" title="Delete (Del)">✕</button>
              </div>
            </div>
            <div class="design-canvas-viewport" id="canvasViewport">
              <div class="design-canvas-container" id="canvasContainer">
                <canvas id="designCanvas" width="960" height="540"></canvas>
              </div>
            </div>
            <div class="canvas-statusbar">
              <span id="canvasCursorPos">0, 0</span>
              <span id="canvasSelectionSize"></span>
              <span>Dragonsel Design Editor</span>
            </div>
          </section>

          <!-- Right Properties Panel -->
          <aside class="design-right-panel">
            <div class="properties-tabs">
              <button class="prop-tab active" data-props="position">Position</button>
              <button class="prop-tab" data-props="style">Style</button>
              <button class="prop-tab" data-props="effects">Effects</button>
            </div>
            <div class="properties-content">
              <div class="props-panel active" id="props-position">
                <strong>Position & Size</strong>
                <div class="prop-row">
                  <label>X</label>
                  <input id="propX" type="number" class="prop-input">
                  <label>Y</label>
                  <input id="propY" type="number" class="prop-input">
                </div>
                <div class="prop-row">
                  <label>W</label>
                  <input id="propW" type="number" class="prop-input">
                  <label>H</label>
                  <input id="propH" type="number" class="prop-input">
                </div>
                <div class="prop-row">
                  <label>Rotation</label>
                  <input id="propRotation" type="number" class="prop-input" value="0">
                  <button id="propFlipH" class="prop-btn">H Flip</button>
                  <button id="propFlipV" class="prop-btn">V Flip</button>
                </div>
                <div class="prop-row">
                  <label>Opacity</label>
                  <input id="propOpacity" type="range" min="0" max="100" value="100" class="prop-range">
                  <span id="propOpacityVal">100%</span>
                </div>
              </div>
              <div class="props-panel" id="props-style">
                <strong>Fill</strong>
                <input id="propFill" type="color" value="#b4122d" class="prop-color">
                <strong>Stroke</strong>
                <input id="propStroke" type="color" value="#000000" class="prop-color">
                <div class="prop-row">
                  <label>Width</label>
                  <input id="propStrokeWidth" type="number" min="0" max="20" value="0" class="prop-input">
                </div>
                <strong>Border Radius</strong>
                <input id="propRadius" type="number" min="0" max="200" value="0" class="prop-input">
              </div>
              <div class="props-panel" id="props-effects">
                <strong>Shadow</strong>
                <div class="prop-row">
                  <label>Blur</label>
                  <input id="propShadowBlur" type="number" min="0" max="50" value="0" class="prop-input">
                </div>
                <div class="prop-row">
                  <label>Color</label>
                  <input id="propShadowColor" type="color" value="#000000" class="prop-color">
                </div>
                <strong>Blur</strong>
                <input id="propBlur" type="number" min="0" max="20" value="0" class="prop-input">
              </div>
            </div>
            <div class="layer-section">
              <strong>Layers</strong>
              <div class="design-layer-list" id="designLayerList"></div>
            </div>
          </aside>
        </div>
      </div>
    `;

    setTimeout(() => this.initDesignCanvas(content), 50);
  }

  initDesignCanvas(content) {
    if (!window.fabric) {
      const area = document.querySelector('.design-canvas-container');
      if (area) area.innerHTML = '<div class="error">Design canvas library failed to load. Check your internet connection and refresh.</div>';
      return;
    }

    const canvas = new fabric.Canvas('designCanvas', {
      preserveObjectStacking: true,
      backgroundColor: '#f7f6f2',
      selection: true,
      stopContextMenu: true,
      snapAngle: 5,
      snapThreshold: 5
    });
    this.currentEditor = canvas;
    this.currentMode = 'design';
    this._undoStack = [];
    this._redoStack = [];
    this._zoomLevel = 1;
    this._pages = [{ name: 'Page 1', canvas: canvas.toJSON(['name']) }];
    this._currentPageIndex = 0;
    this._gridEnabled = true;
    this._snapEnabled = true;

    // Draw grid
    this.drawGrid(canvas);

    this.bindDesignControls(canvas);
    this.bindSidebarTabs();
    this.bindPropertiesPanel(canvas);
    this.bindZoomControls(canvas);
    this.bindUndoRedo(canvas);
    this.bindKeyboardShortcuts(canvas);
    this.createPageThumbnails();
    this.applyDesignTemplate('launch', content);

    canvas.on('selection:created', () => this.syncDesignInspector());
    canvas.on('selection:updated', () => this.syncDesignInspector());
    canvas.on('selection:cleared', () => this.syncDesignInspector());
    canvas.on('object:modified', (e) => {
      this.snapObjectToGrid(e.target);
      this.saveUndoState();
      this.syncDesignInspector();
    });
    canvas.on('object:added', () => this.syncDesignInspector());
    canvas.on('object:removed', () => this.syncDesignInspector());
    canvas.on('mouse:move', (e) => {
      const pointer = canvas.getPointer(e.e);
      const cursorPos = document.getElementById('canvasCursorPos');
      if (cursorPos) cursorPos.textContent = `${Math.round(pointer.x)}, ${Math.round(pointer.y)}`;
    });
    canvas.on('object:moving', (e) => {
      if (this._snapEnabled) this.snapObjectToGrid(e.target);
    });
  }

  drawGrid(canvas) {
    if (!this._gridEnabled) return;
    const gridSize = 20;
    const width = canvas.width || 960;
    const height = canvas.height || 540;
    const lines = [];
    for (let i = 0; i < width / gridSize; i++) {
      lines.push(new fabric.Line([i * gridSize, 0, i * gridSize, height], {
        stroke: 'rgba(0,0,0,0.05)', strokeWidth: 1, selectable: false, evented: false, name: `grid-v-${i}`
      }));
    }
    for (let i = 0; i < height / gridSize; i++) {
      lines.push(new fabric.Line([0, i * gridSize, width, i * gridSize], {
        stroke: 'rgba(0,0,0,0.05)', strokeWidth: 1, selectable: false, evented: false, name: `grid-h-${i}`
      }));
    }
    lines.forEach(line => canvas.add(line));
    // Send grid to back
    lines.forEach(line => canvas.sendToBack(line));
  }

  snapObjectToGrid(obj) {
    if (!this._snapEnabled || !obj) return;
    const gridSize = 20;
    const left = Math.round(obj.left / gridSize) * gridSize;
    const top = Math.round(obj.top / gridSize) * gridSize;
    obj.set({ left, top });
    obj.setCoords();
  }

  createPageThumbnails() {
    // Add page controls to the top bar if not already there
    const topBar = document.querySelector('.design-top-right');
    if (!topBar || document.getElementById('pageControls')) return;

    const pageControls = document.createElement('div');
    pageControls.id = 'pageControls';
    pageControls.className = 'page-controls';
    pageControls.innerHTML = `
      <button id="addPageBtn" class="design-icon-btn" title="Add Page">+</button>
      <span id="pageIndicator">1 / 1</span>
    `;
    topBar.insertBefore(pageControls, topBar.firstChild);

    document.getElementById('addPageBtn')?.addEventListener('click', () => this.addPage());
  }

  addPage() {
    const canvas = this.currentEditor;
    if (!canvas) return;
    // Save current page
    this._pages[this._currentPageIndex].canvas = canvas.toJSON(['name']);
    // Create new page
    const newPageNum = this._pages.length + 1;
    this._pages.push({ name: `Page ${newPageNum}`, canvas: null });
    this._currentPageIndex = this._pages.length - 1;
    // Clear canvas for new page
    canvas.clear();
    this.drawGrid(canvas);
    canvas.backgroundColor = '#f7f6f2';
    this.updatePageIndicator();
    this.saveUndoState();
  }

  switchPage(index) {
    const canvas = this.currentEditor;
    if (!canvas || index === this._currentPageIndex) return;
    // Save current
    this._pages[this._currentPageIndex].canvas = canvas.toJSON(['name']);
    // Load new
    this._currentPageIndex = index;
    if (this._pages[index].canvas) {
      canvas.loadFromJSON(this._pages[index].canvas, () => {
        canvas.requestRenderAll();
        this.drawGrid(canvas);
        this.syncDesignInspector();
      });
    } else {
      canvas.clear();
      this.drawGrid(canvas);
      canvas.backgroundColor = '#f7f6f2';
    }
    this.updatePageIndicator();
  }

  updatePageIndicator() {
    const indicator = document.getElementById('pageIndicator');
    if (indicator) indicator.textContent = `${this._currentPageIndex + 1} / ${this._pages.length}`;
  }

  // Alignment functions
  alignSelected(alignment) {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;

    const canvasWidth = canvas.width || 960;
    const canvasHeight = canvas.height || 540;

    if (active.type === 'activeSelection') {
      // Multi-object alignment
      const objects = active.getObjects();
      objects.forEach(obj => {
        if (alignment === 'left') obj.set('left', 0);
        else if (alignment === 'center') obj.set('left', (canvasWidth - (obj.width * obj.scaleX)) / 2);
        else if (alignment === 'right') obj.set('left', canvasWidth - (obj.width * obj.scaleX));
        else if (alignment === 'top') obj.set('top', 0);
        else if (alignment === 'middle') obj.set('top', (canvasHeight - (obj.height * obj.scaleY)) / 2);
        else if (alignment === 'bottom') obj.set('top', canvasHeight - (obj.height * obj.scaleY));
      });
    } else {
      if (alignment === 'left') active.set('left', 0);
      else if (alignment === 'center') active.set('left', (canvasWidth - (active.width * active.scaleX)) / 2);
      else if (alignment === 'right') active.set('left', canvasWidth - (active.width * active.scaleX));
      else if (alignment === 'top') active.set('top', 0);
      else if (alignment === 'middle') active.set('top', (canvasHeight - (active.height * active.scaleY)) / 2);
      else if (alignment === 'bottom') active.set('top', canvasHeight - (active.height * active.scaleY));
    }
    canvas.requestRenderAll();
    this.saveUndoState();
  }

  bindSidebarTabs() {
    document.querySelectorAll('.sidebar-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.sidebar-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const panelId = `panel-${tab.dataset.panel}`;
        document.querySelectorAll('.sidebar-panel').forEach(panel => {
          panel.classList.toggle('active', panel.id === panelId);
        });
      });
    });

    // Text panel controls
    document.querySelectorAll('[data-text-type]').forEach(btn => {
      btn.addEventListener('click', () => {
        const type = btn.dataset.textType;
        const sizes = { heading: 60, subheading: 40, body: 24, caption: 16 };
        const weights = { heading: 900, subheading: 700, body: 400, caption: 400 };
        this.addDesignText(
          type === 'heading' ? 'Heading' : type === 'subheading' ? 'Subheading' : type === 'body' ? 'Body text' : 'Caption',
          sizes[type] || 24,
          weights[type] || 400
        );
      });
    });

    // Font family
    document.getElementById('designFontFamily')?.addEventListener('change', (e) => {
      const active = this.currentEditor?.getActiveObject();
      if (active && (active.type === 'textbox' || active.type === 'i-text')) {
        active.set('fontFamily', e.target.value);
        this.currentEditor.requestRenderAll();
      }
    });

    // Text align
    document.querySelectorAll('.align-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.align-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const active = this.currentEditor?.getActiveObject();
        if (active && (active.type === 'textbox' || active.type === 'i-text')) {
          active.set('textAlign', btn.dataset.align);
          this.currentEditor.requestRenderAll();
        }
      });
    });

    // Font weight
    document.querySelectorAll('.weight-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.weight-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const active = this.currentEditor?.getActiveObject();
        if (active && (active.type === 'textbox' || active.type === 'i-text')) {
          active.set('fontWeight', parseInt(btn.dataset.weight));
          this.currentEditor.requestRenderAll();
        }
      });
    });

    // Text style buttons
    document.getElementById('designItalic')?.addEventListener('click', () => {
      const active = this.currentEditor?.getActiveObject();
      if (active && (active.type === 'textbox' || active.type === 'i-text')) {
        active.set('fontStyle', active.fontStyle === 'italic' ? 'normal' : 'italic');
        this.currentEditor.requestRenderAll();
      }
    });

    document.getElementById('designUnderline')?.addEventListener('click', () => {
      const active = this.currentEditor?.getActiveObject();
      if (active && (active.type === 'textbox' || active.type === 'i-text')) {
        active.set('underline', !active.underline);
        this.currentEditor.requestRenderAll();
      }
    });

    document.getElementById('designStrike')?.addEventListener('click', () => {
      const active = this.currentEditor?.getActiveObject();
      if (active && (active.type === 'textbox' || active.type === 'i-text')) {
        active.set('linethrough', !active.linethrough);
        this.currentEditor.requestRenderAll();
      }
    });

    // Elements panel
    document.querySelectorAll('[data-shape]').forEach(btn => {
      btn.addEventListener('click', () => {
        const shape = btn.dataset.shape;
        if (shape === 'rect') this.addDesignShape('rect');
        else if (shape === 'circle') this.addDesignShape('circle');
        else if (shape === 'triangle') this.addDesignTriangle();
        else if (shape === 'line' || shape === 'hline') this.addDesignLine(400);
        else if (shape === 'vline') this.addDesignLine(0, 400);
        else if (shape === 'arrow') this.addDesignArrow();
        else if (shape === 'star') this.addDesignStar();
        else if (shape === 'polygon') this.addDesignPolygon();
        else if (shape === 'ellipse') this.addDesignEllipse();
      });
    });
  }

  bindPropertiesPanel(canvas) {
    const updateProps = () => {
      const active = canvas.getActiveObject();
      if (!active) return;

      const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
      setVal('propX', Math.round(active.left || 0));
      setVal('propY', Math.round(active.top || 0));
      setVal('propW', Math.round((active.width || 0) * (active.scaleX || 1)));
      setVal('propH', Math.round((active.height || 0) * (active.scaleY || 1)));
      setVal('propRotation', Math.round(active.angle || 0));
      setVal('propOpacity', Math.round((active.opacity || 1) * 100));
      const opVal = document.getElementById('propOpacityVal');
      if (opVal) opVal.textContent = `${Math.round((active.opacity || 1) * 100)}%`;
      if (typeof active.fill === 'string') setVal('propFill', active.fill);
      if (typeof active.stroke === 'string') setVal('propStroke', active.stroke);
      setVal('propStrokeWidth', active.strokeWidth || 0);
      if (active.rx !== undefined) setVal('propRadius', active.rx || 0);
    };

    ['propX', 'propY', 'propW', 'propH', 'propRotation'].forEach(id => {
      document.getElementById(id)?.addEventListener('change', () => {
        const active = canvas.getActiveObject();
        if (!active) return;
        active.set({
          left: parseInt(document.getElementById('propX')?.value) || active.left,
          top: parseInt(document.getElementById('propY')?.value) || active.top,
          angle: parseInt(document.getElementById('propRotation')?.value) || 0
        });
        const w = parseInt(document.getElementById('propW')?.value);
        const h = parseInt(document.getElementById('propH')?.value);
        if (w) active.set('width', w);
        if (h) active.set('height', h);
        canvas.requestRenderAll();
        this.saveUndoState();
      });
    });

    document.getElementById('propOpacity')?.addEventListener('input', (e) => {
      const active = canvas.getActiveObject();
      if (!active) return;
      active.set('opacity', parseInt(e.target.value) / 100);
      const valEl = document.getElementById('propOpacityVal');
      if (valEl) valEl.textContent = `${e.target.value}%`;
      canvas.requestRenderAll();
    });

    ['propFill', 'propStroke'].forEach(id => {
      document.getElementById(id)?.addEventListener('input', (e) => {
        const active = canvas.getActiveObject();
        if (!active) return;
        const prop = id === 'propFill' ? 'fill' : 'stroke';
        active.set(prop, e.target.value);
        canvas.requestRenderAll();
      });
    });

    document.getElementById('propStrokeWidth')?.addEventListener('input', (e) => {
      const active = canvas.getActiveObject();
      if (!active) return;
      active.set('strokeWidth', parseInt(e.target.value) || 0);
      canvas.requestRenderAll();
    });

    document.getElementById('propRadius')?.addEventListener('input', (e) => {
      const active = canvas.getActiveObject();
      if (!active || active.type !== 'rect') return;
      const r = parseInt(e.target.value) || 0;
      active.set({ rx: r, ry: r });
      canvas.requestRenderAll();
    });

    document.getElementById('propFlipH')?.addEventListener('click', () => {
      const active = canvas.getActiveObject();
      if (!active) return;
      active.set('flipX', !active.flipX);
      canvas.requestRenderAll();
    });

    document.getElementById('propFlipV')?.addEventListener('click', () => {
      const active = canvas.getActiveObject();
      if (!active) return;
      active.set('flipY', !active.flipY);
      canvas.requestRenderAll();
    });

    document.getElementById('propShadowBlur')?.addEventListener('input', (e) => {
      const active = canvas.getActiveObject();
      if (!active) return;
      const blur = parseInt(e.target.value) || 0;
      const color = document.getElementById('propShadowColor')?.value || '#000000';
      active.set('shadow', blur > 0 ? { color, blur, offsetX: 3, offsetY: 3 } : null);
      canvas.requestRenderAll();
    });

    document.getElementById('propBlur')?.addEventListener('input', (e) => {
      const active = canvas.getActiveObject();
      if (!active) return;
      active.set('blur', parseInt(e.target.value) || 0);
      canvas.requestRenderAll();
    });

    canvas.on('selection:created', updateProps);
    canvas.on('selection:updated', updateProps);
  }

  bindZoomControls(canvas) {
    document.getElementById('designZoomIn')?.addEventListener('click', () => {
      this._zoomLevel = Math.min(3, this._zoomLevel + 0.15);
      this.applyZoom();
    });

    document.getElementById('designZoomOut')?.addEventListener('click', () => {
      this._zoomLevel = Math.max(0.1, this._zoomLevel - 0.15);
      this.applyZoom();
    });

    document.getElementById('designZoomFit')?.addEventListener('click', () => {
      this._zoomLevel = 1;
      this.applyZoom();
    });

    const viewport = document.getElementById('canvasViewport');
    viewport?.addEventListener('wheel', (e) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.08 : 0.08;
      this._zoomLevel = Math.max(0.1, Math.min(3, this._zoomLevel + delta));
      this.applyZoom();
    }, { passive: false });
  }

  applyZoom() {
    const container = document.getElementById('canvasContainer');
    const zoomDisplay = document.getElementById('designZoomLevel');
    if (container) container.style.transform = `scale(${this._zoomLevel})`;
    if (zoomDisplay) zoomDisplay.textContent = `${Math.round(this._zoomLevel * 100)}%`;
  }

  bindUndoRedo(canvas) {
    document.getElementById('designUndo')?.addEventListener('click', () => this.undo());
    document.getElementById('designRedo')?.addEventListener('click', () => this.redo());
  }

  saveUndoState() {
    const canvas = this.currentEditor;
    if (!canvas) return;
    this._undoStack.push(JSON.stringify(canvas.toJSON(['name'])));
    if (this._undoStack.length > 30) this._undoStack.shift();
    this._redoStack = [];
  }

  undo() {
    const canvas = this.currentEditor;
    if (!canvas || this._undoStack.length === 0) return;
    const current = JSON.stringify(canvas.toJSON(['name']));
    this._redoStack.push(current);
    const prev = this._undoStack.pop();
    canvas.loadFromJSON(JSON.parse(prev), () => {
      canvas.requestRenderAll();
      this.syncDesignInspector();
    });
  }

  redo() {
    const canvas = this.currentEditor;
    if (!canvas || this._redoStack.length === 0) return;
    const current = JSON.stringify(canvas.toJSON(['name']));
    this._undoStack.push(current);
    const next = this._redoStack.pop();
    canvas.loadFromJSON(JSON.parse(next), () => {
      canvas.requestRenderAll();
      this.syncDesignInspector();
    });
  }

  bindKeyboardShortcuts(canvas) {
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const ctrl = e.ctrlKey || e.metaKey;

      if (ctrl && e.key === 'z' && !e.shiftKey) { e.preventDefault(); this.undo(); }
      if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); this.redo(); }
      if (ctrl && e.key === 'd') { e.preventDefault(); this.duplicateSelected(); }
      if (ctrl && e.key === 'g' && !e.shiftKey) { e.preventDefault(); this.groupSelected(); }
      if (ctrl && e.key === 'g' && e.shiftKey) { e.preventDefault(); this.ungroupSelected(); }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        const active = canvas.getActiveObject();
        if (active && !active.getObjects) { canvas.remove(active); this.saveUndoState(); }
      }
    });
  }

  duplicateSelected() {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active) return;
    active.clone((cloned) => {
      cloned.set({ left: (cloned.left || 0) + 20, top: (cloned.top || 0) + 20 });
      if (cloned.type === 'activeSelection') {
        cloned.canvas = canvas;
        cloned.forEachObject((obj) => canvas.add(obj));
      } else {
        canvas.add(cloned);
      }
      canvas.requestRenderAll();
      this.saveUndoState();
    });
  }

  groupSelected() {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || active.type !== 'activeSelection') return;
    const group = active.toGroup();
    canvas.discardActiveObject().setActiveObject(group).requestRenderAll();
    this.saveUndoState();
  }

  ungroupSelected() {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const active = canvas.getActiveObject();
    if (!active || active.type !== 'group') return;
    const items = active.getObjects();
    active._restoreObjectsState();
    canvas.remove(active);
    items.forEach((item) => canvas.add(item));
    canvas.requestRenderAll();
    this.saveUndoState();
  }

  designGoBack() {
    const editorArea = document.getElementById('editorArea');
    const mode = this.currentMode || 'research';
    const assets = this.brain.assets.filter(a => a.module === mode);
    if (assets.length > 0) {
      const latest = assets[assets.length - 1];
      this.showInEditor(mode, typeof latest.content === 'string' ? latest.content : JSON.stringify(latest.content));
    } else {
      editorArea.innerHTML = `<div class="editor-placeholder"><p>Select a mode above and describe what you want to create.</p></div>`;
    }
  }

  exportDesignSvg() {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const svg = canvas.toSVG();
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.brain.name || 'dragonsel'}-design.svg`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportDesignPdf() {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({ format: 'png' });
    const win = window.open();
    win.document.write(`<img src="${dataUrl}"><p>Right-click image → Save as PDF via print dialog.</p>`);
  }

  addDesignTriangle() {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const fill = document.getElementById('designColor')?.value || '#b4122d';
    const triangle = new fabric.Triangle({ left: 350, top: 180, width: 120, height: 120, fill, name: 'Triangle' });
    canvas.add(triangle);
    canvas.setActiveObject(triangle);
    canvas.requestRenderAll();
    this.saveUndoState();
  }

  addDesignLine(length = 200) {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const stroke = document.getElementById('designColor')?.value || '#111111';
    const line = new fabric.Line([300, 240, 300 + length, 240], { stroke, strokeWidth: 3, name: 'Line' });
    canvas.add(line);
    canvas.setActiveObject(line);
    canvas.requestRenderAll();
    this.saveUndoState();
  }

  addDesignArrow() {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const stroke = document.getElementById('designColor')?.value || '#111111';
    const line = new fabric.Line([280, 240, 460, 240], { stroke, strokeWidth: 3, name: 'Arrow' });
    const head = new fabric.Triangle({ left: 460, top: 225, width: 30, height: 30, fill: stroke, angle: 90, name: 'Arrowhead' });
    canvas.add(line, head);
    canvas.setActiveObject(line);
    canvas.requestRenderAll();
    this.saveUndoState();
  }

  addDesignStar() {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const fill = document.getElementById('designColor')?.value || '#b4122d';
    const points = [];
    for (let i = 0; i < 5; i++) {
      points.push({ x: 60 * Math.cos((i * 2 * Math.PI) / 5), y: 60 * Math.sin((i * 2 * Math.PI) / 5) });
      points.push({ x: 30 * Math.cos(((i + 0.5) * 2 * Math.PI) / 5), y: 30 * Math.sin(((i + 0.5) * 2 * Math.PI) / 5) });
    }
    const star = new fabric.Polygon(points, { left: 350, top: 180, fill, name: 'Star' });
    canvas.add(star);
    canvas.setActiveObject(star);
    canvas.requestRenderAll();
    this.saveUndoState();
  }

  addDesignPolygon() {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const fill = document.getElementById('designColor')?.value || '#0a84ff';
    const points = [];
    for (let i = 0; i < 6; i++) {
      points.push({ x: 60 * Math.cos((i * 2 * Math.PI) / 6), y: 60 * Math.sin((i * 2 * Math.PI) / 6) });
    }
    const poly = new fabric.Polygon(points, { left: 350, top: 180, fill, name: 'Polygon' });
    canvas.add(poly);
    canvas.setActiveObject(poly);
    canvas.requestRenderAll();
    this.saveUndoState();
  }

  addDesignEllipse() {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const fill = document.getElementById('designColor')?.value || '#16835f';
    const ellipse = new fabric.Ellipse({ left: 330, top: 200, rx: 100, ry: 60, fill, name: 'Ellipse' });
    canvas.add(ellipse);
    canvas.setActiveObject(ellipse);
    canvas.requestRenderAll();
    this.saveUndoState();
  }

  bindDesignControls(canvas) {
    // Template cards
    document.querySelectorAll('.template-card').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.template-card').forEach(item => item.classList.remove('active'));
        btn.classList.add('active');
        this.applyDesignTemplate(btn.dataset.template || 'launch');
      });
    });

    // Smart layout buttons (inside templates panel)
    document.querySelectorAll('#panel-templates .design-smart-btn').forEach(btn => {
      btn.addEventListener('click', () => this.applySmartDesignModel(btn.dataset.smartLayout || 'brand'));
    });

    // Brand swatches (large)
    document.querySelectorAll('.brand-swatch-lg').forEach(btn => {
      btn.addEventListener('click', () => {
        const color = btn.dataset.brand || '#111111';
        const input = document.getElementById('designColor');
        if (input) input.value = color;
        const active = canvas.getActiveObject();
        if (active) {
          active.set('fill', color);
          canvas.requestRenderAll();
          this.syncDesignInspector();
        }
      });
    });

    // Add brand color button
    document.getElementById('addBrandColor')?.addEventListener('click', () => {
      const newColor = prompt('Enter hex color (e.g., #ff5733):', '#ff5733');
      if (!newColor) return;
      const brandRow = document.querySelector('.brand-kit-row');
      if (brandRow) {
        const newSwatch = document.createElement('button');
        newSwatch.className = 'brand-swatch-lg';
        newSwatch.dataset.brand = newColor;
        newSwatch.style.background = newColor;
        newSwatch.title = newColor;
        newSwatch.addEventListener('click', () => {
          const active = canvas.getActiveObject();
          if (active) { active.set('fill', newColor); canvas.requestRenderAll(); this.syncDesignInspector(); }
        });
        brandRow.insertBefore(newSwatch, document.getElementById('addBrandColor'));
      }
    });

    // Apply design JSON button (if present)
    document.getElementById('applyDesignJsonBtn')?.addEventListener('click', () => this.applyDesignJson());

    // Toolbar add buttons
    document.getElementById('designAddText')?.addEventListener('click', () => this.addDesignText('Dragonsel', 34));
    document.getElementById('designAddHeading')?.addEventListener('click', () => this.addDesignText('Big idea', 62, true));
    document.getElementById('designAddRect')?.addEventListener('click', () => this.addDesignShape('rect'));
    document.getElementById('designAddCircle')?.addEventListener('click', () => this.addDesignShape('circle'));
    document.getElementById('designAddTriangle')?.addEventListener('click', () => this.addDesignTriangle());
    document.getElementById('designAddLine')?.addEventListener('click', () => this.addDesignLine(400));

    // Toolbar actions
    document.getElementById('designDuplicate')?.addEventListener('click', () => this.duplicateSelected());
    document.getElementById('designGroup')?.addEventListener('click', () => this.groupSelected());
    document.getElementById('designUngroup')?.addEventListener('click', () => this.ungroupSelected());

    document.getElementById('designDelete')?.addEventListener('click', () => {
      const active = canvas.getActiveObject();
      if (active && !active.getObjects) { canvas.remove(active); this.saveUndoState(); }
      else if (active && active.getObjects) { /* group */ }
    });

    document.getElementById('designBringFront')?.addEventListener('click', () => {
      const active = canvas.getActiveObject();
      if (active) { canvas.bringObjectToFront ? canvas.bringObjectToFront(active) : active.bringToFront(); canvas.requestRenderAll(); this.syncDesignInspector(); }
    });
    document.getElementById('designSendBack')?.addEventListener('click', () => {
      const active = canvas.getActiveObject();
      if (active) { canvas.sendObjectToBack ? canvas.sendObjectToBack(active) : active.sendToBack(); canvas.requestRenderAll(); this.syncDesignInspector(); }
    });
    document.getElementById('designFlipH')?.addEventListener('click', () => {
      const active = canvas.getActiveObject();
      if (active) { active.set('flipX', !active.flipX); canvas.requestRenderAll(); }
    });
    document.getElementById('designFlipV')?.addEventListener('click', () => {
      const active = canvas.getActiveObject();
      if (active) { active.set('flipY', !active.flipY); canvas.requestRenderAll(); }
    });

    // Color pickers in toolbar
    document.getElementById('designColor')?.addEventListener('input', (event) => {
      const active = canvas.getActiveObject();
      if (!active) return;
      active.set('fill', event.target.value);
      canvas.requestRenderAll();
      this.syncDesignInspector();
    });
    document.getElementById('designStrokeColor')?.addEventListener('input', (event) => {
      const active = canvas.getActiveObject();
      if (!active) return;
      active.set('stroke', event.target.value);
      canvas.requestRenderAll();
    });
    document.getElementById('designStrokeWidth')?.addEventListener('input', (event) => {
      const active = canvas.getActiveObject();
      if (!active) return;
      active.set('strokeWidth', Number(event.target.value));
      canvas.requestRenderAll();
    });

    // Font size from toolbar (if still present)
    document.getElementById('designFontSize')?.addEventListener('input', (event) => {
      const active = canvas.getActiveObject();
      if (!active || !('fontSize' in active)) return;
      active.set('fontSize', Number(event.target.value));
      canvas.requestRenderAll();
      this.syncDesignInspector();
    });

    // Text input for selected text
    document.getElementById('designTextInput')?.addEventListener('input', (event) => {
      const active = canvas.getActiveObject();
      if (!active || !('text' in active)) return;
      active.set('text', event.target.value);
      canvas.requestRenderAll();
      this.syncDesignInspector();
    });

    // Image upload
    document.getElementById('designImageUpload')?.addEventListener('change', (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const imgUrl = reader.result;
        fabric.Image.fromURL(imgUrl, (img) => {
          if (img) {
            img.scaleToWidth(280);
            img.set({ left: 330, top: 140, name: file.name || 'Image' });
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.requestRenderAll();
            this.saveUndoState();
          }
        });
      };
      reader.readAsDataURL(file);
      event.target.value = '';
    });

    // Upload area drag-and-drop
    const uploadArea = document.getElementById('designUploadArea');
    if (uploadArea) {
      uploadArea.addEventListener('dragover', (e) => { e.preventDefault(); uploadArea.style.borderColor = 'var(--blue)'; });
      uploadArea.addEventListener('dragleave', () => { uploadArea.style.borderColor = ''; });
      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '';
        const files = e.dataTransfer?.files;
        if (files?.length) {
          const file = files[0];
          const reader = new FileReader();
          reader.onload = () => {
            fabric.Image.fromURL(reader.result, (img) => {
              if (img) {
                img.scaleToWidth(280);
                img.set({ left: 330, top: 140, name: file.name || 'Image' });
                canvas.add(img);
                canvas.setActiveObject(img);
                canvas.requestRenderAll();
                this.saveUndoState();
              }
            });
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  applyDesignTemplate(template = 'launch', content = '') {
    const canvas = this.currentEditor;
    if (!canvas) return;

    // Update active state on template cards
    document.querySelectorAll('.template-card').forEach(item => item.classList.remove('active'));
    const activeCard = document.querySelector(`.template-card[data-template="${template}"]`);
    if (activeCard) activeCard.classList.add('active');

    canvas.clear();
    const seed = this.getDesignSeed(content);
    const title = seed.title || this.brain.name || 'Dragonsel';
    const subtitle = seed.subtitle || 'Create everything in one AI workspace';
    const colors = seed.colors?.length ? seed.colors : ['#111111', '#b4122d', '#0a84ff', '#f7f6f2'];

    const addText = (text, left, top, size, fill, width = 620) => {
      const obj = new fabric.Textbox(text, {
        left, top, width, fill, fontSize: size, fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: size > 44 ? 800 : 700, lineHeight: 0.94
      });
      canvas.add(obj);
      return obj;
    };

    const bg = new fabric.Rect({ left: 0, top: 0, width: 960, height: 540, fill: colors[3] || '#f7f6f2', selectable: false, evented: false, name: 'Background' });
    canvas.add(bg);

    if (template === 'thumbnail') {
      canvas.add(new fabric.Rect({ left: 0, top: 0, width: 960, height: 540, fill: colors[0] || '#111111', selectable: false, evented: false, name: 'Dark background' }));
      canvas.add(new fabric.Circle({ left: 660, top: 80, radius: 150, fill: colors[1] || '#b4122d', opacity: 0.95, name: 'Accent circle' }));
      addText(title, 52, 78, 70, '#ffffff', 560);
      addText('Watch the complete build', 58, 372, 34, '#ffffff', 540);
    } else if (template === 'slide') {
      canvas.add(new fabric.Rect({ left: 48, top: 44, width: 864, height: 452, rx: 18, ry: 18, fill: '#ffffff', name: 'Slide surface' }));
      canvas.add(new fabric.Rect({ left: 48, top: 44, width: 16, height: 452, fill: colors[1] || '#b4122d', name: 'Accent bar' }));
      addText(title, 92, 96, 54, colors[0] || '#111111', 690);
      addText(subtitle, 96, 268, 28, '#64615c', 680);
    } else if (template === 'poster') {
      canvas.add(new fabric.Rect({ left: 0, top: 0, width: 960, height: 540, fill: colors[0] || '#111111', selectable: false, evented: false, name: 'Poster background' }));
      canvas.add(new fabric.Rect({ left: 70, top: 68, width: 820, height: 405, fill: '#ffffff', opacity: 0.94, name: 'Poster card' }));
      addText(title, 104, 104, 60, colors[0] || '#111111', 700);
      addText(subtitle, 108, 318, 30, colors[1] || '#b4122d', 690);
    } else {
      canvas.add(new fabric.Rect({ left: 0, top: 0, width: 960, height: 540, fill: colors[0] || '#111111', selectable: false, evented: false, name: 'Launch background' }));
      canvas.add(new fabric.Rect({ left: 600, top: 0, width: 360, height: 540, fill: colors[1] || '#b4122d', name: 'Color panel' }));
      canvas.add(new fabric.Circle({ left: 690, top: 100, radius: 90, fill: colors[2] || '#0a84ff', opacity: 0.85, name: 'Accent shape' }));
      addText(title, 58, 78, 66, '#ffffff', 540);
      addText(subtitle, 62, 345, 30, 'rgba(255,255,255,0.78)', 520);
      addText('Dragonsel', 730, 428, 30, '#ffffff', 190);
    }

    canvas.requestRenderAll();
    this.syncDesignInspector();
  }

  applySmartDesignModel(layout = 'brand') {
    const canvas = this.currentEditor;
    if (!canvas) return;

    const brief = document.getElementById('designJson')?.value || document.getElementById('workspacePrompt')?.value || '';
    const seed = this.getDesignSeed(brief);
    const title = seed.title || 'Dragonsel';
    const subtitle = seed.subtitle || 'One workspace for everything you create';
    const colors = seed.colors?.length ? seed.colors : ['#111111', '#b4122d', '#0a84ff', '#f7f6f2'];

    canvas.clear();
    const bg = new fabric.Rect({ left: 0, top: 0, width: 960, height: 540, fill: colors[3] || '#f7f6f2', selectable: false, evented: false, name: 'Background' });
    canvas.add(bg);

    const text = (value, left, top, size, fill, width, weight = 800) => {
      const obj = new fabric.Textbox(value, {
        left, top, width, fill, fontSize: size, fontFamily: 'Inter, Arial, sans-serif',
        fontWeight: weight, lineHeight: 0.96, name: size > 44 ? 'Headline' : 'Text'
      });
      canvas.add(obj);
      return obj;
    };
    const rect = (left, top, width, height, fill, name, opacity = 1) => {
      const obj = new fabric.Rect({ left, top, width, height, rx: 16, ry: 16, fill, opacity, name });
      canvas.add(obj);
      return obj;
    };

    if (layout === 'social') {
      rect(36, 36, 888, 468, '#ffffff', 'Post surface');
      rect(590, 66, 280, 360, colors[1], 'Hero block');
      rect(630, 106, 150, 150, colors[2], 'Accent media', 0.86);
      text(title, 78, 82, 58, colors[0], 460);
      text(subtitle, 82, 300, 28, '#64615c', 430, 700);
      text('Create free', 82, 416, 24, colors[1], 260);
    } else if (layout === 'pitch') {
      rect(40, 42, 880, 456, '#ffffff', 'Slide surface');
      rect(72, 78, 250, 340, colors[0], 'Preview panel');
      text(title, 360, 86, 54, colors[0], 470);
      text(subtitle, 364, 248, 27, '#64615c', 460, 700);
      ['Research', 'Design', 'Video', 'Build'].forEach((item, i) => {
        rect(362 + i * 112, 390, 92, 54, i % 2 ? colors[2] : colors[1], item);
        text(item, 374 + i * 112, 407, 16, '#ffffff', 72, 800);
      });
    } else if (layout === 'promo') {
      rect(0, 0, 960, 540, colors[0], 'Thumbnail background');
      rect(620, 0, 340, 540, colors[1], 'Action panel');
      canvas.add(new fabric.Circle({ left: 670, top: 78, radius: 130, fill: colors[2], opacity: 0.82, name: 'Focus circle' }));
      text(title.toUpperCase(), 56, 70, 74, '#ffffff', 560, 900);
      text('Made in Dragonsel', 62, 410, 34, '#ffffff', 420);
    } else {
      rect(44, 44, 872, 452, '#ffffff', 'Brand board');
      text(title, 82, 82, 58, colors[0], 520);
      text(subtitle, 86, 210, 26, '#64615c', 500, 700);
      colors.slice(0, 4).forEach((color, i) => {
        rect(92 + i * 112, 350, 82, 82, color, `Brand color ${i + 1}`);
      });
      text('Logo', 650, 120, 54, colors[1], 200, 900);
      rect(642, 214, 210, 150, colors[0], 'Logo card');
      text('D', 716, 250, 78, '#ffffff', 80, 900);
    }

    canvas.requestRenderAll();
    this.syncDesignInspector();
  }

  getDesignSeed(content = '') {
    try {
      const data = JSON.parse(content);
      return {
        title: data.title || data.name || this.brain.name,
        subtitle: data.subtitle || data.layout || 'AI-generated design system',
        colors: Array.isArray(data.colors) ? data.colors : []
      };
    } catch {
      const text = String(content || document.getElementById('workspacePrompt')?.value || '').trim();
      const title = text
        .replace(/^(create|make|design|generate)\s+/i, '')
        .split(/\s+/)
        .slice(0, 6)
        .join(' ');
      return {
        title: title || 'Dragonsel',
        subtitle: 'Research, design, video, web, apps, and export in one place',
        colors: ['#111111', '#b4122d', '#0a84ff', '#f7f6f2']
      };
    }
  }

  addDesignText(text = 'Dragonsel', size = 34, heading = false) {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const obj = new fabric.Textbox(text, {
      left: heading ? 90 : 120,
      top: heading ? 90 : 220,
      width: heading ? 620 : 420,
      fill: document.getElementById('designColor')?.value || '#111111',
      fontSize: size,
      fontFamily: 'Inter, Arial, sans-serif',
      fontWeight: heading ? 900 : 700,
      name: heading ? 'Heading' : 'Text'
    });
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
  }

  addDesignShape(type) {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const fill = document.getElementById('designColor')?.value || '#b4122d';
    const obj = type === 'circle'
      ? new fabric.Circle({ left: 380, top: 170, radius: 70, fill, name: 'Circle' })
      : new fabric.Rect({ left: 320, top: 170, width: 220, height: 120, rx: 14, ry: 14, fill, name: 'Box' });
    canvas.add(obj);
    canvas.setActiveObject(obj);
    canvas.requestRenderAll();
  }

  applyDesignJson() {
    this.applyDesignTemplate(document.querySelector('.design-template-btn.active')?.dataset.template || 'launch', document.getElementById('designJson')?.value || '');
  }

  syncDesignInspector() {
    const canvas = this.currentEditor;
    const list = document.getElementById('designLayerList');
    const meta = document.getElementById('canvasSelectionSize');
    if (!canvas || !list) return;

    // Build layer list (exclude non-selectable background objects)
    const objects = canvas.getObjects().filter(obj => obj.selectable !== false && obj.evented !== false);
    list.innerHTML = objects.slice().reverse().map((obj, index) => {
      const name = obj.name || (obj.text ? obj.text.slice(0, 20) : '') || obj.type || `Layer ${objects.length - index}`;
      const isActive = canvas.getActiveObject() === obj;
      return `<button class="layer-item ${isActive ? 'active' : ''}" type="button" data-layer-index="${objects.indexOf(obj)}">
        <span class="layer-icon">${obj.type === 'textbox' || obj.type === 'i-text' ? 'T' : obj.type === 'rect' ? '□' : obj.type === 'circle' ? '○' : obj.type === 'image' ? '🖼' : '◆'}</span>
        <span class="layer-name">${this.escapeHTML(String(name).slice(0, 24))}</span>
        <span class="layer-eye" onclick="event.stopPropagation(); workspace.toggleLayerVisibility(${objects.indexOf(obj)});">${obj.visible !== false ? '👁' : '🚫'}</span>
      </button>`;
    }).join('');

    list.querySelectorAll('.layer-item').forEach(btn => {
      btn.addEventListener('click', () => {
        const obj = objects[Number(btn.dataset.layerIndex)];
        if (obj) {
          canvas.setActiveObject(obj);
          canvas.requestRenderAll();
          this.syncDesignInspector();
        }
      });
    });

    // Update selection info
    const active = canvas.getActiveObject();
    if (meta) {
      if (active) {
        const w = Math.round((active.width || 0) * (active.scaleX || 1));
        const h = Math.round((active.height || 0) * (active.scaleY || 1));
        meta.textContent = `${w} × ${h}`;
      } else {
        meta.textContent = '';
      }
    }

    // Sync properties panel
    if (active) {
      const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
      setVal('propX', Math.round(active.left || 0));
      setVal('propY', Math.round(active.top || 0));
      setVal('propW', Math.round((active.width || 0) * (active.scaleX || 1)));
      setVal('propH', Math.round((active.height || 0) * (active.scaleY || 1)));
      setVal('propRotation', Math.round(active.angle || 0));
      setVal('propOpacity', Math.round((active.opacity || 1) * 100));
      const opVal = document.getElementById('propOpacityVal');
      if (opVal) opVal.textContent = `${Math.round((active.opacity || 1) * 100)}%`;
      if (typeof active.fill === 'string') setVal('propFill', active.fill);
      if (typeof active.stroke === 'string') setVal('propStroke', active.stroke);
      setVal('propStrokeWidth', active.strokeWidth || 0);
      if (active.rx !== undefined) setVal('propRadius', active.rx || 0);

      // Sync toolbar color pickers
      const colorPicker = document.getElementById('designColor');
      const strokePicker = document.getElementById('designStrokeColor');
      if (colorPicker && typeof active.fill === 'string') colorPicker.value = active.fill;
      if (strokePicker && typeof active.stroke === 'string') strokePicker.value = active.stroke;
      setVal('designStrokeWidth', active.strokeWidth || 0);

      // Sync text inputs if text object
      if (active.type === 'textbox' || active.type === 'i-text') {
        const textInput = document.getElementById('designTextInput');
        if (textInput) textInput.value = active.text || '';
        setVal('designFontSize', active.fontSize || 24);
      }
    }
  }

  toggleLayerVisibility(index) {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const objects = canvas.getObjects().filter(obj => obj.selectable !== false && obj.evented !== false);
    const obj = objects[index];
    if (obj) {
      obj.set('visible', !obj.visible);
      canvas.requestRenderAll();
      this.syncDesignInspector();
    }
  }

  setBrandFromDesign() {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const colors = new Set();
    canvas.getObjects().forEach(obj => {
      if (typeof obj.fill === 'string' && obj.fill.startsWith('#')) colors.add(obj.fill);
      if (typeof obj.stroke === 'string' && obj.stroke.startsWith('#')) colors.add(obj.stroke);
    });
    const brandRow = document.querySelector('.brand-kit-row');
    if (brandRow) {
      brandRow.innerHTML = [...colors].slice(0, 8).map(c =>
        `<button class="brand-swatch-lg" data-brand="${c}" style="background:${c}" title="${c}"></button>`
      ).join('') + '<button class="brand-swatch-add" id="addBrandColor">+ Add</button>';
    }
    alert(`Extracted ${colors.size} colors from design`);
  }

  saveDesignToBrain() {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const data = canvas.toJSON(['name']);
    this.brain.addAsset('design', `${this.brain.name || 'Design'} canvas`, data, 'fabric-json');
    this.brain.save();
    this.refreshBrainUI();
    this.showSaveStatus('Design saved');
  }

  exportDesignPng() {
    const canvas = this.currentEditor;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL({ format: 'png', multiplier: 2 });
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `${this.brain.name || 'dragonsel'}-design.png`;
    a.click();
  }

  showVideoEditor(container, content) {
    try {
      const data = JSON.parse(content);
      const scenes = data.scenes || [];
      container.innerHTML = `
        <div class="editor-header">
          <strong>Video Timeline Editor</strong>
          <div class="editor-actions">
            <button onclick="workspace.downloadCurrent()">📥 Download JSON</button>
          </div>
        </div>
        <div class="video-timeline">
          <div class="timeline-scenes">
            ${scenes.map((s, i) => `
              <div class="timeline-scene" data-index="${i}">
                <div class="scene-header">Scene ${i + 1}</div>
                <div class="scene-content">${s.clip || s.text || 'No content'}</div>
                <div class="scene-transition">${s.transition || 'cut'}</div>
              </div>
            `).join('')}
          </div>
          <div class="timeline-info">
            <p>Duration: ${data.duration || 30}s</p>
            <p>Music: ${data.music || 'None'}</p>
          </div>
        </div>
        <div class="video-raw">
          <strong>Raw JSON (editable):</strong>
          <textarea id="videoJson" style="width:100%;min-height:150px;">${JSON.stringify(data, null, 2)}</textarea>
        </div>
      `;
    } catch {
      this.showTextEditor(container, content, 'video');
    }
  }

  showWebsiteEditor(container, content) {
    container.innerHTML = `
      <div class="editor-header">
        <strong>Website Editor</strong>
        <div class="editor-actions">
          <button onclick="workspace.downloadCurrent()">📥 Download HTML</button>
          <button onclick="workspace.togglePreview()">👁️ Toggle Preview</button>
        </div>
      </div>
      <div class="website-editor">
        <div class="html-editor">
          <textarea id="websiteHtml" style="width:100%;min-height:400px;font-family:monospace;">${content}</textarea>
        </div>
        <div class="html-preview" id="websitePreview">
          <iframe srcdoc="${content.replace(/"/g, '&quot;')}" style="width:100%;height:500px;border:1px solid var(--line);border-radius:8px;"></iframe>
        </div>
      </div>
    `;
  }

  showTextEditor(container, content, mode) {
    const labels = {
      research: 'Research Notes',
      audio: 'Audio Script'
    };
    container.innerHTML = `
      <div class="editor-header">
        <strong>${labels[mode] || 'Text Editor'}</strong>
        <div class="editor-actions">
          <button onclick="workspace.downloadCurrent()">📥 Download</button>
        </div>
      </div>
      <div class="text-editor">
        <textarea id="textContent" style="width:100%;min-height:500px;padding:16px;border:1px solid var(--line);border-radius:8px;font-family:monospace;">${content}</textarea>
      </div>
    `;
  }

  showAppEditor(container, content) {
    container.innerHTML = `
      <div class="editor-header">
        <strong>App Prototype</strong>
        <div class="editor-actions">
          <button onclick="workspace.downloadCurrent()">📥 Download</button>
        </div>
      </div>
      <div class="app-preview">
        <iframe srcdoc="${content.replace(/"/g, '&quot;')}" style="width:100%;height:600px;border:1px solid var(--line);border-radius:8px;"></iframe>
      </div>
    `;
  }

  showExportView(container, content) {
    container.innerHTML = `
      <div class="editor-header">
        <strong>Export Package</strong>
        <div class="editor-actions">
          <button onclick="workspace.exportAll()">📦 Export All as ZIP</button>
        </div>
      </div>
      <div class="export-list">
        <h3>Available Assets:</h3>
        ${this.brain.assets.map(a => `
          <div class="export-item">
            <span class="export-module">${a.module}</span>
            <span class="export-name">${a.name}</span>
            <button onclick="workspace.exportAsset('${a.id}')">Download</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  loadLatestAssetForMode(mode) {
    const assets = this.brain.assets.filter(a => a.module === mode);
    if (assets.length > 0) {
      const latest = assets[assets.length - 1];
      this.showInEditor(mode, typeof latest.content === 'string' ? latest.content : JSON.stringify(latest.content));
      return true;
    }
    return false;
  }

  // ==================== PROJECT MANAGEMENT ====================
  
  setupProjectManagement() {
    document.getElementById('saveProjectBtn')?.addEventListener('click', () => {
      this.brain.save();
      this.showSaveStatus('Saved!');
    });
    
    document.getElementById('newProjectBtn')?.addEventListener('click', () => {
      if (confirm('Create new project? Current will be saved.')) {
        this.brain.save();
        this.brain = new ProjectBrain();
        this.refreshBrainUI();
        this.showSaveStatus('New project created');
      }
    });
    
    document.getElementById('loadProjectBtn')?.addEventListener('click', () => {
      this.showProjectList();
    });
    
    document.getElementById('exportProjectBtn')?.addEventListener('click', () => {
      this.exportAll();
    });
  }

  showProjectList() {
    const projects = ProjectBrain.listProjects();
    const list = projects.map(p => 
      `${p.name} (${new Date(p.updated).toLocaleDateString()}) - ID: ${p.id}`
    ).join('\n');
    
    const id = prompt(`Projects:\n${list}\n\nEnter project ID to load:`);
    if (id) {
      this.brain = ProjectBrain.loadProject(id);
      this.refreshBrainUI();
      this.showSaveStatus('Project loaded');
    }
  }

  showSaveStatus(msg) {
    const status = document.getElementById('saveStatus');
    if (status) {
      status.textContent = msg;
      setTimeout(() => status.textContent = 'Saved', 2000);
    }
  }

  debouncedSave() {
    clearTimeout(this._saveTimer);
    this._saveTimer = setTimeout(() => {
      this.brain.save();
      this.showSaveStatus('Auto-saved');
    }, 1000);
  }

  escapeHTML(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // ==================== DOWNLOAD/EXPORT ====================
  
  downloadCurrent() {
    const mode = this.currentMode;
    if (mode === 'design' && this.currentEditor) {
      this.exportDesignPng();
      return;
    }
    const assets = this.brain.assets.filter(a => a.module === mode);
    if (assets.length === 0) {
      alert('No content to download. Generate something first.');
      return;
    }
    
    const latest = assets[assets.length - 1];
    const content = typeof latest.content === 'string' ? latest.content : JSON.stringify(latest.content, null, 2);
    const ext = mode === 'website' ? 'html' : mode === 'design' ? 'json' : 'txt';
    const filename = `${this.brain.name}-${mode}.${ext}`;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportAll() {
    const manifest = {
      project: this.brain.name,
      exportDate: new Date().toISOString(),
      assets: this.brain.assets.map(a => ({
        module: a.module,
        name: a.name,
        content: a.content
      }))
    };
    
    const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${this.brain.name}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  exportAsset(assetId) {
    const asset = this.brain.assets.find(a => a.id === assetId);
    if (!asset) return;
    
    const content = typeof asset.content === 'string' ? asset.content : JSON.stringify(asset.content, null, 2);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${asset.name}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Initialize when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Wait for brain.js and ai.js to load
  const checkReady = setInterval(() => {
    if (window.ProjectBrain && window.DragonselAI) {
      clearInterval(checkReady);
      window.workspace = new WorkspaceManager();
    }
  }, 100);
  
  // Timeout after 5 seconds
  setTimeout(() => clearInterval(checkReady), 5000);
});

// Also initialize on window load for SPA navigation
window.addEventListener('load', () => {
  if (!window.workspace && window.ProjectBrain && window.DragonselAI) {
    window.workspace = new WorkspaceManager();
  }
});
