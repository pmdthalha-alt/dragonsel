# Dragonsel System Blueprint

Dragonsel is a free-beta AI creation platform that connects research, writing, design, video, websites, apps, game prototypes, and exports into one project workspace.

## Core Flow

1. User enters a prompt, such as `Create a gaming brand launch`.
2. Dragonsel creates a project brain with goals, sources, audience, brand rules, files, tasks, and context.
3. Modules generate connected outputs:
   - Research notes
   - Documents
   - Slide deck
   - Brand kit
   - Website
   - Video timeline
   - App prototype
   - Game concept
   - Export package
4. Users refine everything inside connected editors.
5. Export Center packages the work as links, files, sites, videos, decks, and assets.

## Internal API Routes

- `/api/auth`
- `/api/projects`
- `/api/assets`
- `/api/research`
- `/api/write`
- `/api/design`
- `/api/slides`
- `/api/video`
- `/api/web`
- `/api/app`
- `/api/game`
- `/api/export`
- `/api/feedback`
- `/api/analytics`
- `/api/mcp/tools`

## MCP-Style Tools

Each tool should include:

- name
- description
- input schema
- output schema
- permissions
- example call

### dragonsel_research_summarize

Input:

- sourceIds
- question
- summaryStyle

Output:

- summary
- keyPoints
- citations
- suggestedAssets

### dragonsel_deck_generate

Input:

- topic
- audience
- slideCount
- style
- projectContext

Output:

- outline
- slides
- speakerNotes
- editableDeckJson

### dragonsel_video_generate

Input:

- script
- format
- duration
- assets

Output:

- sceneList
- captions
- transitions
- timelineJson

### dragonsel_site_generate

Input:

- idea
- sections
- style
- assets

Output:

- pageJson
- html
- css
- responsivePreview

### dragonsel_app_generate

Input:

- appIdea
- screens
- dataModels
- actions

Output:

- appSchema
- screens
- workflowMap
- previewStructure

### dragonsel_export_package

Input:

- projectId
- exportTypes

Output:

- downloadLinks
- shareLink
- packageManifest
- exportStatus

## Data Models

### User

- id
- name
- email
- avatar
- betaBadge
- createdAt

### Project

- id
- userId
- title
- prompt
- type
- modules
- assets
- status
- createdAt
- updatedAt

### Asset

- id
- projectId
- type
- name
- url
- content
- metadata
- createdAt

### Source

- id
- projectId
- type
- title
- content
- summary
- citations

### GenerationJob

- id
- projectId
- module
- prompt
- status
- result
- error

### ExportPackage

- id
- projectId
- formats
- files
- shareUrl

### Feedback

- id
- userId
- type
- message
- module
- status

### AnalyticsEvent

- id
- userId
- projectId
- eventName
- metadata
- timestamp

## Beta Rules

Dragonsel is free during early access.

Do not build payment systems yet. Focus on product quality, speed, sharing, feedback, retention, trust, and user love.
