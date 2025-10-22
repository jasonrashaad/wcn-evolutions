# Design Decisions

## UX/UI Rationale

### Physical Metaphor
- **Decision:** Trapper Keeper as core metaphor
- **Why:** Familiar, tactile, promotes sense of control and organization

### View Structure
- **Browse View:** Full-screen folder covers, vertical tablet orientation
- **Working View:** Folder design as frame/border, content in center
- **Why:** Mimics holding physical Trapper Keeper, one focus at a time

### Content Flow (Top to Bottom)
1. Today's Daily Note (read-only, supportive)
2. Today's Tasks (interactive, checkable)
3. Writing/Scratch Area (user input, fresh daily)
4. Supportive Content (read-only, charts/tips)

**Why:** Most important context first, user input in middle, reference material at bottom

### Day Reset
- **Manual trigger** with automatic fallback (if opened after configured time)
- **Per-folder configuration** (different goals have different rhythms)
- **Incomplete tasks flash red → fade** as new tasks generate

**Why:** User control > automation, but catch missed resets gracefully

### Animation Priorities
1. Folder open/close (hero moment)
2. Page tear (day reset)
3. Task completion (satisfying feedback)
4. Browse navigation (smooth flipping)

**Why:** Physical feel drives engagement and ownership

### Customization Philosophy
- **Fully customizable within well-defined parameters**
- **Not open world:** Methodology baked into structure
- **User owns:** Folder themes, day reset config, task parameters

**Why:** Balance between guidance and flexibility

## Technical Rationale

### Vanilla JS + GSAP
- **Why:** Direct DOM control, no framework overhead, animation performance

### Obsidian Vault Integration
- **Why:** User owns data, backend independent, clean separation

### Markdown for Everything
- **Why:** Human-readable, portable, version-controllable, Obsidian-native

### State Management
- Simple JS object, render functions, no reactivity framework
- **Why:** Sufficient for two-view app, keeps complexity low

### File System API
- Browser-based file access (with fallback considerations)
- **Why:** Direct vault integration without server dependency
