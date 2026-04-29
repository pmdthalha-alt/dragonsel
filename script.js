const toolData = {
    write: {
        label: "Dragonsel Write",
        title: "Smart documents, summaries, sources, and idea maps.",
        body: "Bring in references, extract insights, turn research into briefs, then move the same context into design, video, web, and app builds.",
        preview: "write"
    },
    design: {
        label: "Dragonsel Design",
        title: "Brand systems, social graphics, thumbnails, posters, and decks.",
        body: "Generate visual directions, refine layouts, organize reusable brand kits, and prepare assets for every channel.",
        preview: "design"
    },
    video: {
        label: "Dragonsel Video",
        title: "Timeline editing for clips, reels, captions, and launch videos.",
        body: "Create scripts, cut short-form edits, add captions, plan transitions, and export campaign-ready variants.",
        preview: "video"
    },
    web: {
        label: "Dragonsel Web",
        title: "Website builder with sections, CMS structure, and publish tools.",
        body: "Turn a launch idea into responsive pages, reusable sections, content blocks, SEO notes, and shareable previews.",
        preview: "web"
    },
    app: {
        label: "Dragonsel App",
        title: "No-code product builder for tools, forms, portals, and dashboards.",
        body: "Map screens, data fields, actions, user flows, empty states, and handoff notes from one project context.",
        preview: "app"
    },
    game: {
        label: "Dragonsel Game Lab",
        title: "Simple game prototypes, menus, assets, loops, and playable demos.",
        body: "Create a pitchable game concept with screens, mechanics, progression notes, prototype UI, and exportable assets.",
        preview: "game"
    },
    export: {
        label: "Dragonsel Export",
        title: "Publish to web, download files, share links, and present live.",
        body: "Package sites, graphics, videos, decks, app docs, and project notes into a clean launch bundle.",
        preview: "export"
    }
};

const promptOutputs = {
    sneaker: {
        logo: "Strideforge",
        plan: ["Launch teaser", "Creator seeding", "Product drop"]
    },
    gaming: {
        logo: "VoidRift",
        plan: ["Lore trailer", "Discord launch", "Tournament page"]
    },
    startup: {
        logo: "Northstack",
        plan: ["Waitlist page", "Demo reel", "Investor deck"]
    }
};

const studioTools = {
    all: {
        label: "All-in-one generator",
        title: "Complete Dragonsel launch package",
        status: "Full package ready",
        context: "The full package connects research, deck, design, video, website, app, and export around one project brain.",
        pipeline: ["Read prompt", "Create project brain", "Generate every module", "Package export"],
        render: ({ name, prompt }) => `
            <article>
                <strong>Project brain: ${name}</strong>
                <p>${prompt}</p>
                <ul>
                    <li>Audience, goal, style, sources, and assets are stored once.</li>
                    <li>Every module uses the same context so the outputs match.</li>
                    <li>The export center prepares a single shareable launch bundle.</li>
                </ul>
            </article>
            <article>
                <strong>Created outputs</strong>
                <div class="studio-package-grid">
                    <span>Research brief</span><span>Slide deck</span><span>Brand kit</span><span>Video timeline</span><span>Website</span><span>App portal</span>
                </div>
            </article>
        `
    },
    research: {
        label: "Research workspace",
        title: "Ask questions, summarize sources, and build notes",
        status: "Research ready",
        context: "Research works like a source-grounded notebook: uploaded files, links, and notes become answers and summaries.",
        pipeline: ["Collect sources", "Summarize content", "Answer question", "Save notes"],
        render: ({ name, prompt }) => `
            <article>
                <strong>Notebook for ${name}</strong>
                <p>${prompt}</p>
                <div class="studio-note-list">
                    <span>Summary: the project needs a unified AI workspace.</span>
                    <span>Question: what should the first user flow generate?</span>
                    <span>Answer: a connected artifact based on the selected tool.</span>
                </div>
            </article>
            <article>
                <strong>Source cards</strong>
                <ul>
                    <li>Uploaded PDFs and notes</li>
                    <li>Transcript or pasted link</li>
                    <li>Generated citations placeholder</li>
                    <li>Suggested follow-up questions</li>
                </ul>
            </article>
        `
    },
    slides: {
        label: "Slide builder",
        title: "Generate editable slides and speaker notes",
        status: "Deck ready",
        context: "Slides convert the project brain into a pitch, lesson, product deck, report, or launch presentation.",
        pipeline: ["Choose deck goal", "Create outline", "Write slides", "Add notes"],
        render: ({ name }) => `
            <article>
                <strong>Deck: ${name}</strong>
                <ol>
                    <li>Title and promise</li>
                    <li>Problem and audience</li>
                    <li>Solution and product flow</li>
                    <li>Feature modules</li>
                    <li>Launch plan</li>
                    <li>Call to action</li>
                </ol>
            </article>
            <article class="studio-slide-preview">
                <span></span><span></span><span></span>
            </article>
        `
    },
    design: {
        label: "Design studio",
        title: "Drag-drop templates, brand kit, and layouts",
        status: "Design ready",
        context: "Design generates editable layers, template layouts, colors, typography, thumbnails, posters, and social assets.",
        pipeline: ["Pick template", "Generate layers", "Apply brand kit", "Prepare assets"],
        render: ({ name }) => `
            <article>
                <strong>Brand system: ${name}</strong>
                <ul>
                    <li>Logo direction and mark</li>
                    <li>Color palette and type style</li>
                    <li>Poster, thumbnail, social square</li>
                    <li>Editable layers and reusable templates</li>
                </ul>
            </article>
            <article class="studio-design-preview">
                <span></span><span></span><span></span><span></span>
            </article>
        `
    },
    video: {
        label: "Video editor",
        title: "Timeline, captions, trimming, scenes, and exports",
        status: "Video ready",
        context: "Video turns the brief into a timeline with scenes, captions, hook, voiceover, transitions, and platform exports.",
        pipeline: ["Write hook", "Create scenes", "Add captions", "Build timeline"],
        render: ({ name }) => `
            <article>
                <strong>Timeline: ${name}</strong>
                <ol>
                    <li>0-3s hook with bold caption</li>
                    <li>3-10s problem and product reveal</li>
                    <li>10-22s show modules and benefits</li>
                    <li>22-30s export package and CTA</li>
                </ol>
            </article>
            <article class="studio-video-preview">
                <span></span><span></span><span></span><span></span>
            </article>
        `
    },
    website: {
        label: "Website builder",
        title: "Generate pages, sections, forms, and publish preview",
        status: "Website ready",
        context: "Website builder creates landing pages, content sections, SEO text, forms, visual blocks, and a publish checklist.",
        pipeline: ["Write page copy", "Create sections", "Add form", "Prepare publish"],
        render: ({ name }) => `
            <article>
                <strong>Page plan: ${name}</strong>
                <ul>
                    <li>Hero with clear offer</li>
                    <li>Feature grid and workflow demo</li>
                    <li>Use cases and template gallery</li>
                    <li>Signup form and share link</li>
                </ul>
            </article>
            <article class="studio-site-preview">
                <span></span><span></span><span></span><span></span>
            </article>
        `
    },
    app: {
        label: "App builder",
        title: "Generate app screens, data models, and workflows",
        status: "App ready",
        context: "App builder maps screens, records, roles, permissions, actions, workflows, and preview-ready product structure.",
        pipeline: ["Map screens", "Create database", "Add actions", "Preview app"],
        render: ({ name }) => `
            <article>
                <strong>App spec: ${name}</strong>
                <ul>
                    <li>Dashboard, project editor, asset library</li>
                    <li>Data: users, projects, sources, assets, jobs</li>
                    <li>Actions: generate, refine, comment, publish</li>
                    <li>Roles: owner, editor, viewer</li>
                </ul>
            </article>
            <article class="studio-app-preview">
                <span></span><span></span><span></span><span></span>
            </article>
        `
    },
    export: {
        label: "Export center",
        title: "Package files, links, websites, decks, and assets",
        status: "Export ready",
        context: "Export combines generated work into share links, downloads, launch manifests, and project handoff packages.",
        pipeline: ["Check outputs", "Create manifest", "Generate link", "Prepare download"],
        render: ({ name }) => `
            <article>
                <strong>Export bundle: ${name}</strong>
                <ul>
                    <li>Research notes and summaries</li>
                    <li>Deck, design assets, video timeline</li>
                    <li>Website files and app specification</li>
                    <li>Share link and download manifest</li>
                </ul>
            </article>
            <article>
                <strong>Package status</strong>
                <div class="studio-package-grid">
                    <span>Ready</span><span>Versioned</span><span>Shareable</span><span>Downloadable</span>
                </div>
            </article>
        `
    }
};

const systemModules = {
    research: {
        label: "Research module",
        title: "Source-grounded notes and launch insights.",
        body: "Collect references, summarize them, extract key claims, and turn the project brain into briefs, scripts, pages, and deck outlines.",
        script: ["Import sources", "Extract claims", "Create brief", "Send context to all modules"],
        preview: "module-research-preview",
        items: 3
    },
    design: {
        label: "Design module",
        title: "Editable brand kits, graphics, slides, and campaign visuals.",
        body: "Create visual systems with reusable colors, layouts, thumbnails, social posts, presentation slides, and brand rules connected to the project.",
        script: ["Generate style board", "Create reusable layers", "Build social assets", "Attach brand rules"],
        preview: "module-design-preview",
        items: 3
    },
    video: {
        label: "Video module",
        title: "Scripts become timelines, captions, scenes, and short clips.",
        body: "Build reels, trailers, explainers, captions, voiceover notes, transitions, and platform-ready exports from the same launch context.",
        script: ["Write hook", "Create scenes", "Add captions", "Export short-form cuts"],
        preview: "module-video-preview",
        items: 3
    },
    web: {
        label: "Website module",
        title: "Generate landing pages, sections, content, and publish flows.",
        body: "Turn the project into responsive pages with hero copy, sections, SEO notes, assets, forms, and live preview structure.",
        script: ["Build hero", "Add sections", "Connect forms", "Prepare publish preview"],
        preview: "module-web-preview",
        items: 4
    },
    app: {
        label: "App module",
        title: "Prototype dashboards, portals, forms, and workflows.",
        body: "Map screens, data models, roles, actions, empty states, and working app flows without separating them from the launch package.",
        script: ["Map screens", "Create data model", "Add actions", "Preview user flow"],
        preview: "module-app-preview",
        items: 4
    },
    export: {
        label: "Export center",
        title: "Package everything into links, files, sites, decks, and assets.",
        body: "Collect research, docs, brand assets, video timelines, website pages, app screens, and launch notes into one shareable bundle.",
        script: ["Check outputs", "Create file manifest", "Generate share link", "Prepare downloads"],
        preview: "module-export-preview",
        items: 5
    }
};

const systemBuilds = {
    gaming: {
        title: "Gaming Creator Launch",
        summary: "A connected launch workspace for a gaming creator community with research, brand rules, trailer assets, a landing page, and a member portal.",
        brain: ["Audience: creators and gaming fans", "Goal: launch community and content", "Style: bold crimson tech"],
        assets: ["Research brief", "Brand kit", "Trailer timeline", "Landing page", "App portal", "Export bundle"],
        script: "Research the niche, create a bold identity, generate a trailer flow, publish the community page, build a creator portal, then export the full launch kit."
    },
    startup: {
        title: "Startup MVP Launch",
        summary: "A founder workspace that creates market notes, investor copy, pitch visuals, demo video, waitlist site, app prototype, and launch exports.",
        brain: ["Audience: early adopters and investors", "Goal: validate product demand", "Style: clean confident SaaS"],
        assets: ["Market brief", "Pitch deck", "Demo script", "Waitlist page", "MVP screens", "Launch bundle"],
        script: "Study the customer problem, draft the positioning, create investor-ready visuals, generate a demo script, build the waitlist page, and package the MVP launch."
    },
    school: {
        title: "Class Project Studio",
        summary: "A student workspace that turns sources into study notes, reports, slides, explainer videos, project pages, quizzes, and shareable exports.",
        brain: ["Audience: students and teachers", "Goal: learn and present clearly", "Style: bright structured learning"],
        assets: ["Source summary", "Study guide", "Slides", "Explainer video", "Quiz app", "Presentation pack"],
        script: "Upload sources, create a study guide, generate slides, make an explainer video, add a quiz flow, and export the final class presentation pack."
    },
    business: {
        title: "Business Campaign System",
        summary: "A campaign workspace for offers, customer research, brand assets, promo videos, landing pages, lead forms, and client-ready exports.",
        brain: ["Audience: customers and leads", "Goal: convert interest into action", "Style: trustworthy modern brand"],
        assets: ["Customer brief", "Campaign kit", "Ad timeline", "Sales page", "Lead portal", "Client package"],
        script: "Define the offer, summarize customer insight, create campaign assets, generate ad scenes, build the sales page, connect the lead portal, and export the client package."
    }
};

const suiteGenerators = {
    research: {
        label: "Research generator",
        title: "Source notes, citations, and key questions.",
        status: "Research ready",
        steps: ["Read brief", "Extract topics", "Create source map", "Generate notes"],
        build: ({ name, brief }) => `
            <article>
                <strong>Research brief: ${name}</strong>
                <p>${brief}</p>
                <ul>
                    <li>Core question: What is the user trying to create, learn, or launch?</li>
                    <li>Important context: audience, goal, content type, platform, and final format.</li>
                    <li>Missing sources: examples, brand notes, product details, transcripts, files, or links.</li>
                    <li>Next output: turn this research into slides, a video script, a page, or an app plan.</li>
                </ul>
            </article>
            <article>
                <strong>Source-style notes</strong>
                <ol>
                    <li>Summarize the idea in plain language.</li>
                    <li>Pull out facts, claims, features, and unknowns.</li>
                    <li>Make a citation placeholder for every source the user adds later.</li>
                    <li>Save the notes to the project brain so every other tool can use them.</li>
                </ol>
            </article>
        `
    },
    audio: {
        label: "Audio overview generator",
        title: "Podcast-style learning script from your project context.",
        status: "Audio script ready",
        steps: ["Read sources", "Choose format", "Write host script", "Prepare voiceover"],
        build: ({ name }) => `
            <article>
                <strong>Audio overview: ${name}</strong>
                <p><strong>Host A:</strong> Today we are breaking down ${name}, what it is, who it helps, and how the pieces connect.</p>
                <p><strong>Host B:</strong> The important part is that the project is not one isolated file. The research, design, video, website, app, and export all share the same context.</p>
                <p><strong>Host A:</strong> So the listener should understand the idea, the workflow, and the next action by the end.</p>
            </article>
            <article>
                <strong>Audio structure</strong>
                <ol>
                    <li>Opening hook: why this matters.</li>
                    <li>Simple explanation of the project.</li>
                    <li>Three key insights from the source material.</li>
                    <li>Practical examples and use cases.</li>
                    <li>Final recap and next step.</li>
                </ol>
            </article>
        `
    },
    slides: {
        label: "Slide generator",
        title: "Editable deck outline with speaker notes.",
        status: "Deck ready",
        steps: ["Create outline", "Write slides", "Add speaker notes", "Prepare deck JSON"],
        build: ({ name }) => `
            <article>
                <strong>Slide deck: ${name}</strong>
                <ol>
                    <li>Title: ${name}</li>
                    <li>Problem: creators waste time jumping between disconnected tools.</li>
                    <li>Audience: students, creators, founders, teams, and builders.</li>
                    <li>Solution: one AI workspace that creates connected outputs.</li>
                    <li>Workflow: choose a tool, describe the goal, generate, refine, export.</li>
                    <li>Proof: faster first drafts, shared context, reusable assets.</li>
                    <li>Next step: start a free project and publish the first package.</li>
                </ol>
            </article>
            <article>
                <strong>Speaker notes</strong>
                <p>Keep each slide short. Explain that Dragonsel creates a first version, then the user edits and exports it. The strongest message is that every output comes from the same project brain.</p>
            </article>
        `
    },
    design: {
        label: "Design generator",
        title: "Brand kit, social assets, thumbnails, and layouts.",
        status: "Brand kit ready",
        steps: ["Pick style", "Create layers", "Generate assets", "Save brand rules"],
        build: ({ name }) => `
            <article>
                <strong>Brand kit: ${name}</strong>
                <ul>
                    <li>Logo direction: sharp wordmark with a compact icon mark.</li>
                    <li>Colors: ink black, crimson action, electric blue, clean white, soft neutral.</li>
                    <li>Typography: bold display headings with readable interface text.</li>
                    <li>Asset set: poster, thumbnail, slide cover, social square, website hero.</li>
                </ul>
            </article>
            <article class="artifact-visual design-artifact">
                <span></span><span></span><span></span><span></span>
            </article>
        `
    },
    video: {
        label: "Video generator",
        title: "Scene list, captions, voiceover, and timeline plan.",
        status: "Video plan ready",
        steps: ["Write hook", "Create scenes", "Generate captions", "Build timeline"],
        build: ({ name }) => `
            <article>
                <strong>Video timeline: ${name}</strong>
                <ol>
                    <li>0-3s: Show the problem with fast text and a bold visual.</li>
                    <li>3-8s: Introduce Dragonsel as the all-in-one AI workspace.</li>
                    <li>8-18s: Show research, slides, design, video, website, and app outputs.</li>
                    <li>18-25s: Show export package and share link.</li>
                    <li>25-30s: Call to action: Start creating free.</li>
                </ol>
            </article>
            <article class="artifact-visual video-artifact">
                <span></span><span></span><span></span><span></span>
            </article>
        `
    },
    website: {
        label: "Website generator",
        title: "Landing page sections and publish-ready structure.",
        status: "Website ready",
        steps: ["Write page copy", "Create sections", "Map assets", "Prepare publish"],
        build: ({ name }) => `
            <article>
                <strong>Website page: ${name}</strong>
                <ul>
                    <li>Hero: One workspace for everything you create.</li>
                    <li>Product demo: pick a tool, describe the goal, generate the first version.</li>
                    <li>Feature sections: research, slides, design, video, app, export.</li>
                    <li>Social proof: built for creators, students, founders, teams.</li>
                    <li>CTA: Start creating free. No credit card needed.</li>
                </ul>
            </article>
            <article class="artifact-visual website-artifact">
                <span></span><span></span><span></span><span></span>
            </article>
        `
    },
    app: {
        label: "App builder",
        title: "Screens, data models, roles, and workflows.",
        status: "App spec ready",
        steps: ["Plan screens", "Create data model", "Add actions", "Prepare preview"],
        build: ({ name }) => `
            <article>
                <strong>App prototype: ${name}</strong>
                <ul>
                    <li>Dashboard: active projects, generated artifacts, recent exports.</li>
                    <li>Project editor: prompt, sources, tasks, files, modules.</li>
                    <li>Asset library: images, decks, videos, pages, app screens.</li>
                    <li>Roles: owner, editor, viewer, invited collaborator.</li>
                    <li>Actions: generate, refine, save version, comment, publish, export.</li>
                </ul>
            </article>
            <article>
                <strong>Data model</strong>
                <p>User, Project, Source, Asset, GenerationJob, ExportPackage, Feedback, AnalyticsEvent.</p>
            </article>
        `
    },
    export: {
        label: "Export package",
        title: "Everything bundled into one launch kit.",
        status: "Export ready",
        steps: ["Check files", "Create manifest", "Generate links", "Package downloads"],
        build: ({ name }) => `
            <article>
                <strong>Launch package: ${name}</strong>
                <ul>
                    <li>Research brief and source notes</li>
                    <li>Slide deck outline and speaker notes</li>
                    <li>Brand kit and social assets</li>
                    <li>Video timeline and caption script</li>
                    <li>Website page structure</li>
                    <li>App prototype spec</li>
                </ul>
            </article>
            <article>
                <strong>Share package</strong>
                <p>Dragonsel creates a share link, download manifest, export checklist, and version record so the whole project can move together.</p>
            </article>
        `
    }
};

const mcpData = {
    research: {
        tool: "dragonsel_research_summarize",
        title: "Summarize uploaded sources into usable project knowledge.",
        body: "Input: source IDs, question, summary style. Output: summary, key points, citations, suggested next assets.",
        input: {
            sourceIds: ["src_001", "src_002"],
            question: "What should this launch focus on?",
            style: "brief"
        }
    },
    deck: {
        tool: "dragonsel_deck_generate",
        title: "Generate an editable presentation from project context.",
        body: "Input: topic, audience, slide count, style. Output: slide outline, slide content, speaker notes, editable deck JSON.",
        input: {
            topic: "Gaming brand launch",
            audience: "sponsors and creators",
            slideCount: 10,
            style: "premium"
        }
    },
    video: {
        tool: "dragonsel_video_generate",
        title: "Create a short-form video timeline from a script and assets.",
        body: "Input: script, format, duration, assets. Output: scenes, captions, transitions, timeline JSON.",
        input: {
            script: "Launch trailer for VoidRift Arena",
            format: "shorts",
            duration: 30,
            assets: ["logo_01", "hero_art"]
        }
    },
    site: {
        tool: "dragonsel_site_generate",
        title: "Generate a responsive website or landing page structure.",
        body: "Input: business idea, sections, style, assets. Output: page JSON, HTML, CSS, responsive preview metadata.",
        input: {
            idea: "Competitive gaming brand",
            sections: ["hero", "features", "trailer", "community"],
            style: "clean crimson tech"
        }
    },
    app: {
        tool: "dragonsel_app_generate",
        title: "Create a no-code app prototype with screens and actions.",
        body: "Input: app idea, screens, data models, actions. Output: app schema, screen list, workflow map.",
        input: {
            idea: "Creator campaign portal",
            screens: ["dashboard", "submissions", "analytics"],
            actions: ["approve", "comment", "export"]
        }
    },
    export: {
        tool: "dragonsel_export_package",
        title: "Package all project outputs into a shareable launch bundle.",
        body: "Input: project ID, export types. Output: download links, share link, manifest, export status.",
        input: {
            projectId: "proj_008",
            types: ["site", "deck", "video", "brand-kit"]
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    initStudioApp();
    initStageTilt();
    initToolTabs();
    initMcpTabs();
    initConnectedBuilder();
    initCreationSuite();
    initPromptDemo();
    initReveal();
    initEnergyLine();
});

function initStudioApp() {
    const tools = document.querySelectorAll(".studio-tool");
    const generate = document.getElementById("studioGenerate");
    const example = document.getElementById("studioUseExample");
    const prompt = document.getElementById("studioPrompt");
    let activeTool = "all";

    tools.forEach((tool) => {
        tool.addEventListener("click", () => {
            tools.forEach((item) => item.classList.remove("active"));
            tool.classList.add("active");
            activeTool = tool.dataset.studioTool || "all";
            renderStudioApp(activeTool, false);
        });
    });

    generate?.addEventListener("click", () => {
        renderStudioApp(activeTool, true);
    });

    example?.addEventListener("click", () => {
        if (prompt) {
            prompt.value = "Create a launch system for an AI creator platform with research notes, a pitch deck, brand assets, promo video, landing page, app portal, and export package.";
        }
        activeTool = "all";
        tools.forEach((item) => item.classList.toggle("active", item.dataset.studioTool === "all"));
        renderStudioApp(activeTool, true);
    });
}

function renderStudioApp(toolKey, generated) {
    const tool = studioTools[toolKey] || studioTools.all;
    const prompt = document.getElementById("studioPrompt")?.value.trim() || "A new Dragonsel project";
    const name = createProjectName(prompt);
    const safePrompt = escapeHtml(prompt.length > 260 ? `${prompt.slice(0, 257)}...` : prompt);
    const label = document.getElementById("studioOutputLabel");
    const title = document.getElementById("studioOutputTitle");
    const status = document.getElementById("studioOutputStatus");
    const body = document.getElementById("studioOutputBody");
    const pipeline = document.getElementById("studioPipeline");
    const context = document.getElementById("studioContext");

    if (label) label.textContent = tool.label;
    if (title) title.textContent = tool.title;
    if (status) status.textContent = generated ? tool.status : "Ready";
    if (body) {
        body.innerHTML = tool.render({ name, prompt: safePrompt });
        pulse(body);
    }
    if (pipeline) {
        pipeline.innerHTML = tool.pipeline.map((item) => `<span>${escapeHtml(item)}</span>`).join("");
    }
    if (context) context.textContent = tool.context;
}

function initTheme() {
    const toggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("dragonsel-theme");

    if (savedTheme === "dark") {
        document.body.classList.add("theme-dark");
        toggle?.setAttribute("aria-pressed", "true");
    }

    toggle?.addEventListener("click", () => {
        const isDark = document.body.classList.toggle("theme-dark");
        toggle.setAttribute("aria-pressed", String(isDark));
        localStorage.setItem("dragonsel-theme", isDark ? "dark" : "light");
    });
}

function initConnectedBuilder() {
    const prompt = document.getElementById("systemPrompt");
    const runButton = document.getElementById("runSystemBuild");
    const tabs = document.querySelectorAll(".system-tab");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            tabs.forEach((item) => item.classList.remove("active"));
            tab.classList.add("active");
            renderSystemModule(tab.dataset.systemModule);
        });
    });

    runButton?.addEventListener("click", () => {
        const value = prompt?.value.toLowerCase() || "";
        const key = value.includes("school") || value.includes("class") ? "school" : value.includes("startup") || value.includes("mvp") ? "startup" : value.includes("business") || value.includes("campaign") ? "business" : "gaming";
        renderSystemBuild(key);
    });
}

function initCreationSuite() {
    const modes = document.querySelectorAll(".suite-mode");
    const generate = document.getElementById("generateSuite");
    const clear = document.getElementById("clearSuite");
    const brief = document.getElementById("suiteBrief");
    const keyInput = document.getElementById("apiKey");

    modes.forEach((mode) => {
        mode.addEventListener("click", () => {
            modes.forEach((item) => item.classList.remove("active"));
            mode.classList.add("active");
            renderSuite(mode.dataset.suite);
        });
    });

    generate?.addEventListener("click", async () => {
        const active = document.querySelector(".suite-mode.active");
        const mode = active?.dataset.suite || "research";
        await renderSuite(mode, true);
    });

    clear?.addEventListener("click", () => {
        if (brief) brief.value = "Create a slide deck about Dragonsel AI workspace like NotebookLM.";
        if (keyInput) keyInput.value = '';
        modes.forEach((item) => item.classList.remove("active"));
        modes[0]?.classList.add("active");
        renderSuite("research");
        localStorage.removeItem('dragonsel_api_key');
        if (window.DragonselAI) window.DragonselAI.initAI('');
    });

    // Init AI if key saved
    if (window.DragonselAI && localStorage.getItem('dragonsel_api_key')) {
        window.DragonselAI.initAI(localStorage.getItem('dragonsel_api_key'));
    }
}

async function renderSuite(key, generateAI = false) {
    const data = suiteGenerators[key] || suiteGenerators.research;
    const brief = document.getElementById("suiteBrief")?.value.trim() || "A new Dragonsel project";
    const keyInput = document.getElementById("apiKey")?.value.trim();
    const label = document.getElementById("suiteLabel");
    const title = document.getElementById("suiteTitle");
    const status = document.getElementById("suiteStatus");
    const artifact = document.getElementById("suiteArtifact");
    const escapedBrief = escapeHtml(brief.length > 240 ? `${brief.slice(0, 237)}...` : brief);
    const name = createProjectName(brief);

    if (label) label.textContent = data.label;
    if (title) title.textContent = data.title;

    if (generateAI) {
        if (status) status.textContent = 'Generating with AI...';
        try {
            if (keyInput && !window.DragonselAI.API_KEY) {
                window.DragonselAI.initAI(keyInput);
            }
            const aiResponse = await window.DragonselAI.generate(key, brief);
            if (status) status.textContent = data.status;

            let rendered = `<article><strong>AI Generated:</strong><pre style="background:#111;color:#fff;padding:12px;border-radius:7px;overflow:auto;max-height:300px;">${escapeHtml(aiResponse.slice(0, 1500))}</pre></article>`;

            // Mode-specific render
            if (key === 'slides') {
                const slidesHtml = window.DragonselAI.renderSlides(aiResponse);
rendered += `<article><button onclick="downloadBlob('${btoa(unescape(slidesHtml))}', '${name}-slides.html')">Download Slides</button><iframe srcdoc="${slidesHtml.replace(/"/g, '"')}" style="width:100%;height:300px;border-radius:8px;border:1px solid var(--line);margin-top:8px;"></iframe></article>`;
            } else if (key === 'website') {
                rendered += `<article><button onclick="downloadBlob('${btoa(aiResponse)}', '${name}-site.html')">Download Site</button><iframe srcdoc="${aiResponse.replace(/"/g, '"')}" style="width:100%;height:300px;border-radius:8px;border:1px solid var(--line);margin-top:8px;"></iframe></article>`;
            } else {
                // JSON parse attempt
                try {
                    const json = JSON.parse(aiResponse);
                    rendered += `<article><strong>Parsed JSON:</strong><pre>${JSON.stringify(json, null, 2)}</pre></article>`;
                } catch {}
            }

            if (artifact) {
                artifact.innerHTML = rendered;
                const steps = document.createElement("article");
                steps.innerHTML = `<strong>Steps:</strong><ol>${data.steps.map(item => `<li>${escapeHtml(item)}</li>`).join('')}</ol>`;
                artifact.appendChild(steps);
            }
        } catch (error) {
            if (status) status.textContent = 'Error: ' + error.message;
            if (artifact) artifact.innerHTML = `<article style="color:red;">${error.message}. Check API key (Groq free tier).</article>`;
        }
    } else {
        if (status) status.textContent = "Ready";
        if (artifact) {
            artifact.innerHTML = data.build({ name, brief: escapedBrief });
            const steps = document.createElement("article");
            steps.className = "suite-steps";
            steps.innerHTML = `<strong>How Dragonsel builds it</strong><ol>${data.steps.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
            artifact.appendChild(steps);
            pulse(artifact);
        }
    }
}

// Global download helper
function downloadBlob(base64, filename) {
    const byteStr = atob(base64);
    const bytes = new Uint8Array(byteStr.length);
    for (let i = 0; i < byteStr.length; i++) bytes[i] = byteStr.charCodeAt(i);
    const blob = new Blob([bytes]);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}


function createProjectName(text) {
    const cleaned = text
        .replace(/^(create|build|make|generate|design)\s+/i, "")
        .replace(/[^\w\s-]/g, "")
        .trim()
        .split(/\s+/)
        .slice(0, 5)
        .join(" ");

    return escapeHtml(cleaned || "Dragonsel project");
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function renderSystemBuild(key) {
    const build = systemBuilds[key] || systemBuilds.gaming;
    const title = document.getElementById("systemProjectTitle");
    const summary = document.getElementById("systemProjectSummary");
    const brainList = document.getElementById("systemBrainList");
    const assetFeed = document.getElementById("systemAssetFeed");
    const status = document.getElementById("systemStatus");
    const launchScript = document.getElementById("launchScript");

    if (title) title.textContent = build.title;
    if (summary) summary.textContent = build.summary;
    if (brainList) brainList.innerHTML = build.brain.map((item) => `<span>${item}</span>`).join("");
    if (assetFeed) assetFeed.innerHTML = build.assets.map((item) => `<span>${item}</span>`).join("");
    if (status) status.textContent = `${build.assets.length} connected outputs ready`;
    if (launchScript) {
        launchScript.innerHTML = `<strong>Launch script</strong><p>${build.script}</p>`;
    }

    const shell = document.querySelector(".connected-builder");
    if (shell) pulse(shell);
}

function renderSystemModule(moduleKey) {
    const data = systemModules[moduleKey] || systemModules.research;
    const panel = document.getElementById("systemModulePanel");

    if (!panel) {
        return;
    }

    panel.innerHTML = `
        <div>
            <span class="mini-label">${data.label}</span>
            <h3>${data.title}</h3>
            <p>${data.body}</p>
            <ul class="module-script">
                ${data.script.map((item) => `<li>${item}</li>`).join("")}
            </ul>
        </div>
        <div class="module-preview ${data.preview}" aria-hidden="true">
            ${Array.from({ length: data.items }, () => "<span></span>").join("")}
        </div>
    `;
    pulse(panel);
}

function initStageTilt() {
    const stage = document.getElementById("productStage");
    const windowEl = stage?.querySelector(".workspace-window");

    if (!stage || !windowEl || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    stage.addEventListener("mousemove", (event) => {
        const rect = stage.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        windowEl.style.transform = `rotateX(${2 - y * 4}deg) rotateY(${-4 + x * 6}deg) translateY(-2px)`;
    });

    stage.addEventListener("mouseleave", () => {
        windowEl.style.transform = "rotateX(2deg) rotateY(-4deg)";
    });
}

function initToolTabs() {
    const tabs = document.querySelectorAll(".tool-tab");
    const panel = document.getElementById("toolPanel");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const data = toolData[tab.dataset.tool];

            if (!data || !panel) {
                return;
            }

            tabs.forEach((item) => item.classList.remove("active"));
            tab.classList.add("active");

            panel.innerHTML = `
                <div>
                    <span class="mini-label">${data.label}</span>
                    <h3>${data.title}</h3>
                    <p>${data.body}</p>
                </div>
                <div class="tool-preview ${data.preview}-preview">
                    ${createPreviewMarkup(data.preview)}
                </div>
            `;
            pulse(panel);
        });
    });
}

function createPreviewMarkup(type) {
    if (type === "video") {
        return `<div class="mini-timeline"><i></i><i></i><i></i></div><div class="doc-line wide"></div><div class="doc-line"></div>`;
    }

    if (type === "design") {
        return `<div class="swatches"><i></i><i></i><i></i></div><div class="mini-deck"></div>`;
    }

    if (type === "web") {
        return `<div class="mini-page"></div>`;
    }

    if (type === "app") {
        return `<div class="mini-deck"></div><div class="doc-line wide"></div><div class="doc-line short"></div>`;
    }

    if (type === "game") {
        return `<div class="mock-browser"><div></div><strong>Level 01</strong><p>Prototype menu and loop</p></div>`;
    }

    if (type === "export") {
        return `<div class="plan-output"><ul><li>Website package</li><li>Video exports</li><li>Brand assets</li></ul></div>`;
    }

    return `<div class="doc-line wide"></div><div class="doc-line"></div><div class="doc-line short"></div><div class="mind-map"><span></span><span></span><span></span></div>`;
}

function initMcpTabs() {
    const tabs = document.querySelectorAll(".mcp-tab");
    const panel = document.getElementById("mcpPanel");

    tabs.forEach((tab) => {
        tab.addEventListener("click", () => {
            const data = mcpData[tab.dataset.mcp];

            if (!data || !panel) {
                return;
            }

            tabs.forEach((item) => item.classList.remove("active"));
            tab.classList.add("active");

            panel.innerHTML = `
                <div>
                    <span class="mini-label">${data.tool}</span>
                    <h3>${data.title}</h3>
                    <p>${data.body}</p>
                </div>
                <pre><code>${JSON.stringify({ tool: data.tool, input: data.input }, null, 2)}</code></pre>
            `;
            pulse(panel);
        });
    });
}

function initPromptDemo() {
    const input = document.getElementById("demoPrompt");
    const button = document.getElementById("generateDemo");
    const grid = document.getElementById("generatedGrid");

    button?.addEventListener("click", () => {
        const value = input?.value.toLowerCase() || "";
        const key = value.includes("gaming") ? "gaming" : value.includes("startup") ? "startup" : "sneaker";
        const output = promptOutputs[key];

        if (!grid || !output) {
            return;
        }

        grid.querySelector(".logo-output strong").textContent = output.logo;
        const plan = grid.querySelector(".plan-output ul");
        plan.innerHTML = output.plan.map((item) => `<li>${item}</li>`).join("");
        pulse(grid);
    });
}

function initReveal() {
    const revealItems = document.querySelectorAll(
        ".section-header, .section-copy, .connected-builder, .builder-command, .system-brain-panel, .system-workbench, .system-output-panel, .suite-shell, .suite-input-panel, .suite-output-panel, .workflow-card, .module-card, .studio-system article, .prompt-demo, .tool-panel, .engine-flow article, .engine-window, .api-card, .mcp-console, .route-list span, .backend-cards article, .data-grid article, .template-card, .why-grid article, .free-access-card, .invite-card, .feedback-grid article, .analytics-list span, .roadmap-card, .public-grid article, .final-cta"
    );

    revealItems.forEach((item) => item.classList.add("reveal"));

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.14 });

    revealItems.forEach((item) => observer.observe(item));
}

function initEnergyLine() {
    const line = document.querySelector(".energy-line");

    if (!line || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        return;
    }

    window.addEventListener("scroll", () => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const progress = max > 0 ? window.scrollY / max : 0;
        line.style.transform = `scaleX(${Math.max(0.18, progress)})`;
    }, { passive: true });
}

function pulse(element) {
    element.classList.remove("pulse-once");
    window.requestAnimationFrame(() => {
        element.classList.add("pulse-once");
    });
}
