# Architecture Documentation

## System Overview

WCN Evolutions Day Timer is a view layer web application that provides a Trapper Keeper interface for interacting with Obsidian vault files.

## Architecture Layers

### 1. Presentation Layer (This Application)
**Tech Stack:**
- Vanilla JavaScript (ES6+)
- GSAP (GreenSock Animation Platform)
- HTML5 / CSS3
- No build tools required (direct browser execution)

**Responsibilities:**
- Render Browse View (folder gallery)
- Render Working View (folder content)
- Handle user interactions
- Animate state transitions
- Read/write markdown files

### 2. Data Layer (Obsidian Vault)
**Structure:**
```
vault/
├── goal-1/
│   ├── 2025-10-22.md          # Daily writing/scratch
│   ├── daily-notes/
│   │   └── 2025-10-22.md      # Generated supportive note
│   ├── tasks/
│   │   └── 2025-10-22.json    # Task state
│   └── config.json            # Folder configuration
├── goal-2/
│   └── ...
└── vault-config.json          # Global configuration
```

**File Formats:**
- Daily notes: Markdown (.md)
- Tasks: JSON (.json)
- Configuration: JSON (.json)

### 3. Analysis Layer (Separate Backend)
**Components:**
- Ollama (LLM orchestration)
- Mistral (language model)
- faster-whisper (speech-to-text)

**Responsibilities:**
- Analyze user notes
- Generate tasks
- Create supportive content
- Output results into vault structure

**Interface:** Writes directly to vault files, no API needed

## Application State

```javascript
const appState = {
  // View management
  currentView: 'browse',        // 'browse' | 'working'

  // Folder management
  folders: [],                   // Array of folder objects
  openFolder: null,              // Currently open folder ID

  // Content management
  currentDayNote: '',            // Markdown content for writing area
  currentTasks: [],              // Task objects for today
  supportiveNote: '',            // Read-only daily note
  supportiveContent: '',         // Charts, tips, etc.

  // Day reset tracking
  lastDayReset: null,            // Timestamp of last reset
  dayResetConfig: {},            // Per-folder day reset configuration

  // Incomplete task handling
  incompleteTasks: [],           // Tasks from previous day
  showingIncompleteTasks: false  // Flag for flash animation
};
```

## View Architecture

### Browse View
```
┌────────────────────────────────────┐
│                                    │
│    ┌──────────────────────┐       │
│    │                      │       │
│    │   Folder Cover       │       │  ← Full screen
│    │   Design             │       │     folder graphic
│    │                      │       │
│    └──────────────────────┘       │
│                                    │
└────────────────────────────────────┘
```

**DOM Structure:**
```html
<div id="browse-view">
  <div class="folder-carousel">
    <div class="folder-cover" data-folder-id="1">
      <!-- SVG or image for folder design -->
    </div>
    <div class="folder-cover" data-folder-id="2">
      <!-- SVG or image for folder design -->
    </div>
  </div>
  <div class="browse-controls">
    <!-- Navigation arrows, folder count, etc. -->
  </div>
</div>
```

### Working View
```
┌─[Folder Frame]─────────────────────┐
│                                    │
│  ┌─────────────────────────────┐  │
│  │ Today's Daily Note          │  │  ← Read-only
│  └─────────────────────────────┘  │
│                                    │
│  ┌─────────────────────────────┐  │
│  │ Today's Tasks               │  │  ← Interactive
│  └─────────────────────────────┘  │
│                                    │
│  ┌─────────────────────────────┐  │
│  │ Writing/Scratch Area        │  │  ← User input
│  └─────────────────────────────┘  │
│                                    │
│  ┌─────────────────────────────┐  │
│  │ Supportive Content          │  │  ← Read-only
│  └─────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

**DOM Structure:**
```html
<div id="working-view">
  <div class="folder-frame">
    <!-- Visual border/frame with folder design -->
  </div>

  <div class="content-container">
    <section class="daily-note-section">
      <!-- Rendered markdown, read-only -->
    </section>

    <section class="tasks-section">
      <!-- Checkable task list -->
    </section>

    <section class="writing-section">
      <!-- Textarea or contenteditable for markdown -->
    </section>

    <section class="supportive-section">
      <!-- Charts, tips, rendered content -->
    </section>
  </div>

  <div class="working-controls">
    <!-- Close, day reset, etc. -->
  </div>
</div>
```

## GSAP Animation Architecture

### Animation Timeline Structure
```javascript
// Folder open sequence
const openFolderTimeline = gsap.timeline();
openFolderTimeline
  .to('.folder-cover', { /* 3D lift */ })
  .to('.folder-cover', { /* rotate and expand */ })
  .to('#browse-view', { /* fade out */ })
  .to('#working-view', { /* fade in */ })
  .staggerFrom('.content-section', { /* reveal sections */ });

// Day reset sequence
const dayResetTimeline = gsap.timeline();
dayResetTimeline
  .to('.writing-section', { /* page tear effect */ })
  .to('.incomplete-tasks', { /* red flash */ })
  .to('.incomplete-tasks', { /* fade out */ })
  .from('.new-tasks', { /* fade in */ });
```

### Key Animation Moments
1. **Folder Open:** 3D lift, rotate, expand, view transition
2. **Folder Close:** Reverse of open
3. **Day Reset:** Page tear, incomplete task flash, content refresh
4. **Task Complete:** Checkmark, line-through, subtle celebration
5. **Browse Navigation:** Smooth page flipping between folders

## File System Integration

### Read Operations
```javascript
// Pseudo-code for reading vault files
async function loadFolderContent(folderId, date) {
  const basePath = `vault/${folderId}`;

  // Read supportive daily note
  const supportiveNote = await readMarkdownFile(
    `${basePath}/daily-notes/${date}.md`
  );

  // Read user's writing
  const writing = await readMarkdownFile(
    `${basePath}/${date}.md`
  );

  // Read tasks
  const tasks = await readJSONFile(
    `${basePath}/tasks/${date}.json`
  );

  return { supportiveNote, writing, tasks };
}
```

### Write Operations
```javascript
// Pseudo-code for writing vault files
async function saveWritingArea(folderId, date, content) {
  const filePath = `vault/${folderId}/${date}.md`;
  await writeMarkdownFile(filePath, content);
}

async function saveTaskState(folderId, date, tasks) {
  const filePath = `vault/${folderId}/tasks/${date}.json`;
  await writeJSONFile(filePath, tasks);
}
```

## Day Reset Logic

### Trigger Conditions
1. **Manual:** User clicks "New Day" button
2. **Automatic:** User opens folder after configured time has elapsed

### Reset Flow
```
1. Check if reset needed
   - Compare current date/time with last reset
   - Check folder's day reset configuration

2. If reset needed:
   a. Save current writing area content
   b. Save current task state
   c. Load incomplete tasks from previous day
   d. Trigger GSAP animation sequence
   e. Clear writing area
   f. Load new supportive note
   g. Generate new tasks
   h. Flash incomplete tasks (red) → fade
   i. Update lastDayReset timestamp

3. If no reset needed:
   a. Load existing content for today
   b. Resume where user left off
```

### Configuration Format
```json
{
  "folderId": "goal-1",
  "dayResetType": "calendar",  // 'calendar' | 'time' | 'custom'
  "resetTime": "00:00",        // For 'time' type
  "customLogic": null          // For 'custom' type
}
```

## Integration Points

### With Obsidian Vault
- **Read:** Markdown files, JSON config files
- **Write:** User's daily notes, task completion state
- **Watch:** File system changes (for live updates, optional)

### With Backend Analysis
- **Input:** Backend reads markdown files from vault
- **Output:** Backend writes generated content to vault
- **Sync:** No direct communication, vault is shared data store

### Future Considerations
- File system API for browser-based file access
- LocalStorage fallback for configuration
- Service worker for offline capability
- Vault sync conflict resolution

## Performance Considerations

### GSAP Optimization
- Use `will-change` CSS property for animated elements
- Leverage GPU acceleration with `transform` and `opacity`
- Reuse timelines where possible
- Clean up completed animations

### DOM Management
- Lazy load folder covers (only visible folders)
- Destroy and recreate working view on folder change
- Use DocumentFragment for batch DOM updates
- Debounce writing area saves

### File I/O
- Cache frequently accessed files
- Batch write operations
- Use async/await for non-blocking I/O
- Implement file watching efficiently

## Security Considerations

- Sanitize markdown rendering (prevent XSS)
- Validate file paths (prevent directory traversal)
- Handle file system errors gracefully
- No sensitive data in localStorage/sessionStorage
