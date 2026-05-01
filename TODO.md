# Dragonsel Phase 1: Core Foundation — Production Checklist

## Backend API Enhancements
- [x] 1.1 Create `/api/ai/generate` endpoint with intent-based structured generation
- [x] 1.2 Enhance AI service with JSON mode, tool-specific system prompts
- [x] 1.3 Add `/api/ai/intent` endpoint for smart prompt routing
- [x] 1.4 Update server.js with new AI routes

- [ ] 1.5 Add project autosave endpoint
- [ ] 1.6 Add file upload endpoint for assets

## Frontend Core — Auth & API
- [ ] 2.1 Add auth modal to index.html (login/signup)
- [ ] 2.2 Create API client in app.js with JWT handling
- [ ] 2.3 Add auto-save to backend on project changes
- [ ] 2.4 Add loading states and error handling

## AI Chatbot & Routing
- [ ] 3.1 Replace mock `makePayload()` with real AI generation via backend
- [ ] 3.2 Enhance `detectIntent()` with AI-powered classification
- [ ] 3.3 Add streaming response for chat
- [ ] 3.4 Add quick-action buttons from AI responses

## Design Workspace (Canva-like)
- [ ] 4.1 Add more templates (social posts, stories, banners)
- [ ] 4.2 Add alignment tools (center, distribute, snap)
- [ ] 4.3 Add undo/redo system
- [ ] 4.4 Add image upload and filters
- [ ] 4.5 Add PDF export option
- [ ] 4.6 Add brand kit save/load

## Slides Workspace
- [ ] 5.1 Add slide navigator sidebar with thumbnails
- [ ] 5.2 Add new slide / duplicate / delete controls
- [ ] 5.3 Add slide templates (title, content, split, image)
- [ ] 5.4 Add presenter notes panel
- [ ] 5.5 Add presentation mode overlay

## Website Builder Workspace
- [ ] 6.1 Add component sidebar (hero, features, testimonials, CTA, forms)
- [ ] 6.2 Add drag-to-add sections
- [ ] 6.3 Add section editor (text, colors, images)
- [ ] 6.4 Add page manager (add/edit pages)
- [ ] 6.5 Add live preview sync
- [ ] 6.6 Add publish settings panel

## Apple-Level Polish
- [ ] 7.1 Add page transition animations
- [ ] 7.2 Add tool-switching animations
- [ ] 7.3 Add shimmer loading skeletons
- [ ] 7.4 Add toast notification system
- [ ] 7.5 Add keyboard shortcuts
- [ ] 7.6 Enhance responsive design

## Export System
- [ ] 8.1 Add export options per tool (PNG, JPG, PDF, PPTX, MP4, ZIP)
- [ ] 8.2 Add project package export
- [ ] 8.3 Add share link generation
