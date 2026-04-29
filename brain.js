/**
 * Dragonsel Project Brain - Connected context system
 * Shared across all generation modules
 */

class ProjectBrain {
  constructor(projectId = null) {
    this.id = projectId || this._generateId();
    this.name = 'Untitled Project';
    this.created = Date.now();
    this.updated = Date.now();
    
    // Core context (shared across all modules)
    this.sources = []; // { id, type: 'file'|'url'|'text', title, content, summary }
    this.context = {
      audience: '',
      goal: '',
      style: '',
      brandRules: {
        colors: [],
        fonts: [],
        tone: ''
      }
    };
    
    // Generated assets (output of each module)
    this.assets = []; // { id, module: 'slides'|'design'|..., type, name, content, timestamp }
    
    // Generation history
    this.history = []; // { timestamp, module, prompt, output }
    
    // Load if exists
    if (projectId) this.load();
  }

  // Generate unique ID
  _generateId() {
    return 'proj_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // Add source material
  addSource(type, title, content) {
    const source = {
      id: 'src_' + Date.now().toString(36),
      type, // 'file', 'url', 'text'
      title,
      content,
      summary: '',
      timestamp: Date.now()
    };
    this.sources.push(source);
    this.updated = Date.now();
    return source;
  }

  // Update context
  updateContext(updates) {
    Object.assign(this.context, updates);
    this.updated = Date.now();
  }

  // Add generated asset
  addAsset(module, name, content, type = 'json') {
    const asset = {
      id: 'asset_' + Date.now().toString(36),
      module, // 'research', 'slides', 'design', 'video', 'website', 'app', 'export'
      name,
      content,
      type,
      timestamp: Date.now()
    };
    this.assets.push(asset);
    this.history.push({
      timestamp: Date.now(),
      module,
      prompt: name,
      output: typeof content === 'string' ? content.slice(0, 200) : JSON.stringify(content).slice(0, 200)
    });
    this.updated = Date.now();
    return asset;
  }

  // Get context for AI prompts (formats brain into prompt text)
  getContextForPrompt() {
    let contextStr = '';
    
    // Add sources summary
    if (this.sources.length > 0) {
      contextStr += '\n\nSources:\n';
      this.sources.forEach(src => {
        contextStr += `- ${src.title}: ${src.summary || src.content.slice(0, 100)}\n`;
      });
    }
    
    // Add context fields
    if (this.context.audience) contextStr += `\nAudience: ${this.context.audience}`;
    if (this.context.goal) contextStr += `\nGoal: ${this.context.goal}`;
    if (this.context.style) contextStr += `\nStyle: ${this.context.style}`;
    
    // Add brand rules
    if (this.context.brandRules.colors.length > 0) {
      contextStr += `\nBrand Colors: ${this.context.brandRules.colors.join(', ')}`;
    }
    if (this.context.brandRules.fonts.length > 0) {
      contextStr += `\nBrand Fonts: ${this.context.brandRules.fonts.join(', ')}`;
    }
    if (this.context.brandRules.tone) {
      contextStr += `\nTone: ${this.context.brandRules.tone}`;
    }
    
    // Add recent assets summary
    if (this.assets.length > 0) {
      contextStr += '\n\nExisting Assets:\n';
      this.assets.slice(-5).forEach(asset => {
        contextStr += `- ${asset.module}: ${asset.name}\n`;
      });
    }
    
    return contextStr;
  }

  // Save to localStorage
  save() {
    const projects = this._getProjects();
    const projectData = {
      id: this.id,
      name: this.name,
      created: this.created,
      updated: this.updated,
      sources: this.sources,
      context: this.context,
      assets: this.assets,
      history: this.history
    };
    
    projects[this.id] = projectData;
    localStorage.setItem('dragonsel_projects', JSON.stringify(projects));
    localStorage.setItem('dragonsel_current_project', this.id);
  }

  // Load from localStorage
  load() {
    const projects = this._getProjects();
    const data = projects[this.id];
    if (!data) return false;
    
    this.name = data.name || this.name;
    this.created = data.created || this.created;
    this.updated = data.updated || this.updated;
    this.sources = data.sources || [];
    this.context = data.context || this.context;
    this.assets = data.assets || [];
    this.history = data.history || [];
    return true;
  }

  // Delete project
  delete() {
    const projects = this._getProjects();
    delete projects[this.id];
    localStorage.setItem('dragonsel_projects', JSON.stringify(projects));
    if (localStorage.getItem('dragonsel_current_project') === this.id) {
      localStorage.removeItem('dragonsel_current_project');
    }
  }

  // Get all saved projects
  static listProjects() {
    const projects = JSON.parse(localStorage.getItem('dragonsel_projects') || '{}');
    return Object.values(projects).sort((a, b) => b.updated - a.updated);
  }

  // Load a specific project
  static loadProject(projectId) {
    return new ProjectBrain(projectId);
  }

  // Get current project or create new
  static currentProject() {
    const currentId = localStorage.getItem('dragonsel_current_project');
    if (currentId) {
      const proj = new ProjectBrain(currentId);
      if (proj.load()) return proj;
    }
    return new ProjectBrain();
  }

  // Internal: get projects object
  _getProjects() {
    return JSON.parse(localStorage.getItem('dragonsel_projects') || '{}');
  }
}

// Export to window
window.ProjectBrain = ProjectBrain;
