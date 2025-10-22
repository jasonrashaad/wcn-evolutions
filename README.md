# WCN Evolutions - Day Timer

## Project Summary

A personal management application that uses the visual and functional metaphor of a physical Trapper Keeper. Users organize goals/projects into themed, colorful folders with a tactile, animated interface that prioritizes the feeling of control and ownership over algorithmic surprise.

**Core Concept:** Build a Trapper Keeper UI as a web app that reads/writes to Obsidian vault files, providing a purpose-built view layer for a specific personal productivity workflow.

### Key Features

- **Browse View:** Full-screen folder designs representing each Goal/Project. Users flip through folders like pages.
- **Working View:** Selected folder opens to reveal daily content with folder design as visual frame
- **Daily Notes:** Fresh writing area each day, automatically generated supportive content
- **Task Management:** Automated task generation from stored data, stateful within day boundaries
- **Day Reset:** Configurable per folder, manual trigger with automatic fresh page on next open
- **Physical Metaphor:** GSAP animations make interactions feel tactile (folder opening, page tearing, task completion)

### Tech Stack

- **Frontend:** Vanilla JavaScript + GSAP (animations) + HTML/CSS
- **Data Layer:** Obsidian vault (markdown files)
- **Backend:** Separate analysis layer (outputs into vault)
- **No Framework:** Pure web standards for maximum performance and control

### Architecture

```
┌─────────────────────────────────────────┐
│  Trapper Keeper UI (Web App)           │
│  - HTML/CSS/GSAP/Vanilla JS             │
│  - Reads/writes markdown files          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Obsidian Vault (Data Store)            │
│  - Markdown files                       │
│  - User notes, tasks, metadata          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│  Backend Analysis (Separate)            │
│  - Ollama + Mistral + faster-whisper    │
│  - Outputs analysis into vault          │
└─────────────────────────────────────────┘
```

## Project Initialization Prompt

**Context:** Build a Trapper Keeper-style web application for personal goal management that integrates with Obsidian markdown files.

**Requirements:**
1. **Tech Stack:** Vanilla JavaScript, GSAP for animations, HTML/CSS only (no frameworks)
2. **Two Main Views:**
   - Browse View: Full-screen folder covers, swipeable/flippable
   - Working View: Opened folder with content sections inside folder visual frame
3. **Working View Content (top to bottom):**
   - Today's Daily Note (read-only, supportive content)
   - Today's Tasks (generated, checkable list)
   - Writing/Scratch Area (user input, markdown, fresh daily)
   - Supportive Content (read-only, charts/tips)
4. **Day Reset Logic:**
   - Manual trigger or automatic on next open after configured time
   - "Page tear" animation with GSAP
   - Incomplete tasks flash red then fade as new tasks generate
   - Configurable per folder (calendar day, specific time, etc.)
5. **GSAP Animations:**
   - Folder open/close (3D lift, rotate, expand to fill screen)
   - Page tear on day reset
   - Task completion celebrations
   - Browse view flipping/swiping
6. **Data Model:**
   - Read/write markdown files from Obsidian vault structure
   - File pattern: `goal-name/YYYY-MM-DD.md` for daily notes
   - Tasks and metadata stored alongside in predictable structure
7. **State Management:**
   - Simple vanilla JS state object
   - Render functions for each view
   - No framework reactivity needed

**Design Principles:**
- Tactile, physical interactions (like holding a tablet with a real Trapper Keeper)
- One folder open at a time (visual focus)
- Deliberate user actions drive state changes (not automatic timers)
- Full customization within well-defined parameters
- Clean separation: UI reads/writes vault, backend analyzes separately

**Visual Metaphor:** Think physical Trapper Keeper - colorful folders, page flipping, deliberate opening/closing, fresh paper each day.

## Getting Started

1. Clone repository
2. Set up local web server (any HTTP server will do)
3. Configure Obsidian vault path in config
4. Open in browser and start organizing goals

## Documentation

See `docs/` folder for:
- Architecture decisions
- Development progress
- Design specifications
- Integration guides

## License

See LICENSE file for details.
