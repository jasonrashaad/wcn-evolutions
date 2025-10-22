/**
 * View Rendering & Management
 */

const Views = {
  /**
   * Initialize views
   */
  init() {
    this.renderBrowseView();
    this.attachEventListeners();
  },

  /**
   * Render Browse View with current folders
   */
  renderBrowseView() {
    const carousel = document.querySelector('.folder-carousel');
    const counter = document.querySelector('.folder-counter');

    if (!carousel) return;

    // Clear existing folders
    carousel.innerHTML = '';

    // Render folders
    AppState.folders.forEach((folder, index) => {
      const folderEl = this.createFolderCover(folder, index);
      carousel.appendChild(folderEl);
    });

    // Update counter
    if (counter) {
      counter.textContent = `${AppState.currentFolderIndex + 1} / ${AppState.folders.length}`;
    }

    // Update visibility (only show current folder prominently)
    this.updateFolderVisibility();
  },

  /**
   * Create folder cover element
   */
  createFolderCover(folder, index) {
    const folderEl = document.createElement('div');
    folderEl.className = 'folder-cover';
    folderEl.dataset.folderId = folder.id;
    folderEl.dataset.index = index;

    const design = document.createElement('div');
    design.className = 'folder-design';
    design.style.background = `linear-gradient(135deg, ${folder.color} 0%, ${this.adjustColor(folder.color, -30)} 100%)`;

    const title = document.createElement('h2');
    title.className = 'folder-title';
    title.textContent = folder.title;

    const description = document.createElement('p');
    description.className = 'folder-description';
    description.textContent = folder.description;

    design.appendChild(title);
    design.appendChild(description);
    folderEl.appendChild(design);

    return folderEl;
  },

  /**
   * Update folder visibility in carousel
   */
  updateFolderVisibility() {
    const folders = document.querySelectorAll('.folder-cover');
    folders.forEach((folder, index) => {
      if (index === AppState.currentFolderIndex) {
        folder.style.transform = 'scale(1) translateY(0)';
        folder.style.opacity = '1';
        folder.style.pointerEvents = 'auto';
        folder.style.zIndex = '10';
      } else {
        folder.style.transform = 'scale(0.95) translateY(20px)';
        folder.style.opacity = '0.5';
        folder.style.pointerEvents = 'none';
        folder.style.zIndex = '1';
      }
    });
  },

  /**
   * Render Working View for current folder
   */
  renderWorkingView() {
    if (!AppState.openFolder) return;

    const folder = AppState.openFolder;

    // Update folder frame colors
    this.updateFolderFrame(folder);

    // Render sections
    this.renderDailyNote();
    this.renderTasks();
    this.renderWritingArea();
    this.renderSupportiveContent();
  },

  /**
   * Update folder frame styling
   */
  updateFolderFrame(folder) {
    const frames = ['.frame-top', '.frame-right', '.frame-bottom', '.frame-left', '.folder-tab'];
    const gradient = `linear-gradient(135deg, ${folder.color} 0%, ${this.adjustColor(folder.color, -30)} 100%)`;

    frames.forEach(selector => {
      const element = document.querySelector(selector);
      if (element) {
        element.style.background = gradient;
      }
    });

    // Update tab title
    const tabTitle = document.querySelector('.folder-tab-title');
    if (tabTitle) {
      tabTitle.textContent = folder.title;
    }
  },

  /**
   * Render daily note section
   */
  renderDailyNote() {
    const content = document.querySelector('.daily-note-content');
    if (!content) return;

    if (AppState.supportiveNote) {
      // Render markdown (will use MarkdownRenderer when implemented)
      content.innerHTML = MarkdownRenderer.render(AppState.supportiveNote);
    } else {
      // Demo content
      content.innerHTML = `
        <p><strong>Welcome back!</strong></p>
        <p>Focus on making progress today, not perfection. Small steps forward.</p>
      `;
    }
  },

  /**
   * Render tasks section
   */
  renderTasks() {
    const taskList = document.querySelector('.task-list');
    const incompleteFlash = document.querySelector('.incomplete-tasks-flash');

    if (!taskList) return;

    // Clear existing tasks
    taskList.innerHTML = '';

    // Show incomplete tasks flash if needed
    if (AppState.showingIncompleteTasks && AppState.incompleteTasks.length > 0) {
      incompleteFlash.innerHTML = `
        <div class="incomplete-task-warning">
          ${AppState.incompleteTasks.length} task(s) from yesterday still incomplete
        </div>
      `;

      // Animate flash
      setTimeout(() => {
        Animations.incompleteTasksFlash(
          incompleteFlash.querySelectorAll('.incomplete-task-warning'),
          () => {
            incompleteFlash.innerHTML = '';
            AppState.clearIncompleteTasks();
          }
        );
      }, 500);
    }

    // Render current tasks
    if (AppState.currentTasks.length > 0) {
      AppState.currentTasks.forEach(task => {
        const taskEl = TaskManager.createTaskElement(task);
        taskList.appendChild(taskEl);
      });
    } else {
      // Demo tasks
      const demoTasks = [
        { id: 'task-1', text: 'Review yesterday\'s progress', completed: false },
        { id: 'task-2', text: 'Work on main objective for 25 minutes', completed: false },
        { id: 'task-3', text: 'Document what you learned', completed: false }
      ];
      AppState.currentTasks = demoTasks;

      demoTasks.forEach(task => {
        const taskEl = TaskManager.createTaskElement(task);
        taskList.appendChild(taskEl);
      });
    }
  },

  /**
   * Render writing area
   */
  renderWritingArea() {
    const textarea = document.querySelector('.writing-textarea');
    const charCount = document.querySelector('.char-count');

    if (!textarea) return;

    // Set content
    textarea.value = AppState.currentDayNote;

    // Update character count
    if (charCount) {
      charCount.textContent = `${textarea.value.length} characters`;
    }

    // Attach input listener
    textarea.addEventListener('input', (e) => {
      AppState.currentDayNote = e.target.value;
      if (charCount) {
        charCount.textContent = `${e.target.value.length} characters`;
      }
      this.saveWritingDebounced();
    });
  },

  /**
   * Render supportive content section
   */
  renderSupportiveContent() {
    const content = document.querySelector('.supportive-content');
    if (!content) return;

    if (AppState.supportiveContent) {
      content.innerHTML = MarkdownRenderer.render(AppState.supportiveContent);
    } else {
      // Demo content
      content.innerHTML = `
        <p><strong>Progress Tip:</strong> Break large tasks into 25-minute focused sessions.</p>
        <p><em>Remember: consistency beats intensity.</em></p>
      `;
    }
  },

  /**
   * Attach event listeners
   */
  attachEventListeners() {
    // Browse view navigation
    document.querySelector('.prev-btn')?.addEventListener('click', () => {
      this.navigateFolders('prev');
    });

    document.querySelector('.next-btn')?.addEventListener('click', () => {
      this.navigateFolders('next');
    });

    // Folder open
    document.addEventListener('click', (e) => {
      const folderCover = e.target.closest('.folder-cover');
      if (folderCover && !AppState.isAnimating) {
        const folderId = folderCover.dataset.folderId;
        this.openFolder(folderId, folderCover);
      }
    });

    // Close folder
    document.querySelector('.close-btn')?.addEventListener('click', () => {
      if (!AppState.isAnimating) {
        this.closeFolder();
      }
    });

    // Day reset
    document.querySelector('.reset-day-btn')?.addEventListener('click', () => {
      if (!AppState.isAnimating) {
        this.triggerDayReset();
      }
    });
  },

  /**
   * Navigate between folders in browse view
   */
  navigateFolders(direction) {
    if (AppState.isAnimating) return;

    const newIndex = direction === 'next'
      ? (AppState.currentFolderIndex + 1) % AppState.folders.length
      : (AppState.currentFolderIndex - 1 + AppState.folders.length) % AppState.folders.length;

    Animations.flipFolder(direction, () => {
      AppState.setCurrentFolderIndex(newIndex);
      this.renderBrowseView();
    });
  },

  /**
   * Open folder and transition to working view
   */
  openFolder(folderId, folderElement) {
    if (!AppState.openFolderById(folderId)) {
      console.error('Folder not found:', folderId);
      return;
    }

    // Check if day reset needed
    if (AppState.needsDayReset()) {
      AppState.performDayReset();
    }

    // Animate folder open
    Animations.openFolder(folderElement, () => {
      AppState.currentView = 'working';
      this.renderWorkingView();
    });
  },

  /**
   * Close folder and transition to browse view
   */
  closeFolder() {
    // Save current work
    this.saveWriting();

    // Animate folder close
    Animations.closeFolder(() => {
      AppState.currentView = 'browse';
      AppState.closeFolder();
      this.renderBrowseView();
    });
  },

  /**
   * Trigger day reset
   */
  triggerDayReset() {
    // Save current work
    this.saveWriting();

    // Perform reset
    const incompleteTasks = AppState.performDayReset();

    // Animate page tear
    Animations.pageTear(() => {
      // Re-render working view with fresh content
      this.renderWorkingView();
    });
  },

  /**
   * Save writing area content
   */
  saveWriting() {
    if (AppState.openFolder && AppState.currentDayNote) {
      FileSystem.saveWritingArea(
        AppState.openFolder.id,
        new Date(),
        AppState.currentDayNote
      );

      const lastSaved = document.querySelector('.last-saved');
      if (lastSaved) {
        lastSaved.textContent = `Saved at ${new Date().toLocaleTimeString()}`;
      }
    }
  },

  /**
   * Debounced save writing
   */
  saveWritingDebounced: (() => {
    let timeout;
    return function() {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        Views.saveWriting();
      }, CONFIG.ui.autoSaveDelay);
    };
  })(),

  /**
   * Utility: Adjust color brightness
   */
  adjustColor(color, amount) {
    // Simple hex color adjustment
    const clamp = (val) => Math.min(255, Math.max(0, val));
    const num = parseInt(color.replace('#', ''), 16);
    const r = clamp((num >> 16) + amount);
    const g = clamp(((num >> 8) & 0x00FF) + amount);
    const b = clamp((num & 0x0000FF) + amount);
    return `#${(0x1000000 + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Views;
}
