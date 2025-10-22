/**
 * Application State Management
 */

const AppState = {
  // View management
  currentView: 'browse', // 'browse' | 'working'

  // Folder management
  folders: [],
  currentFolderIndex: 0,
  openFolder: null,

  // Content management
  currentDayNote: '',
  currentTasks: [],
  supportiveNote: '',
  supportiveContent: '',

  // Day reset tracking
  lastDayReset: null,
  dayResetConfig: {},

  // Incomplete task handling
  incompleteTasks: [],
  showingIncompleteTasks: false,

  // UI state
  isAnimating: false,

  /**
   * Initialize state with demo data or from storage
   */
  init() {
    if (CONFIG.demo.enabled) {
      this.folders = CONFIG.demo.folders;
    } else {
      // Load from localStorage or file system
      this.loadFromStorage();
    }
  },

  /**
   * Get current folder
   */
  getCurrentFolder() {
    return this.folders[this.currentFolderIndex] || null;
  },

  /**
   * Set current folder by index
   */
  setCurrentFolderIndex(index) {
    if (index >= 0 && index < this.folders.length) {
      this.currentFolderIndex = index;
    }
  },

  /**
   * Open a folder (transition to working view)
   */
  openFolderById(folderId) {
    const folder = this.folders.find(f => f.id === folderId);
    if (folder) {
      this.openFolder = folder;
      return true;
    }
    return false;
  },

  /**
   * Close current folder (transition to browse view)
   */
  closeFolder() {
    this.openFolder = null;
    this.currentDayNote = '';
    this.currentTasks = [];
    this.supportiveNote = '';
    this.supportiveContent = '';
  },

  /**
   * Check if day reset is needed for current folder
   */
  needsDayReset() {
    if (!this.openFolder) return false;

    const now = new Date();
    const lastReset = this.lastDayReset ? new Date(this.lastDayReset) : null;

    if (!lastReset) return true;

    const resetType = this.openFolder.dayResetType || CONFIG.dayReset.defaultType;

    switch (resetType) {
      case 'calendar':
        // Reset if different calendar day
        return now.toDateString() !== lastReset.toDateString();

      case 'time':
        // Reset if past configured time and different from last reset
        const resetTime = this.openFolder.resetTime || CONFIG.dayReset.defaultTime;
        const [hours, minutes] = resetTime.split(':').map(Number);
        const resetDateTime = new Date(now);
        resetDateTime.setHours(hours, minutes, 0, 0);

        return now >= resetDateTime && now.toDateString() !== lastReset.toDateString();

      case 'custom':
        // Custom logic (to be implemented)
        return false;

      default:
        return false;
    }
  },

  /**
   * Perform day reset
   */
  performDayReset() {
    // Save incomplete tasks
    this.incompleteTasks = this.currentTasks.filter(task => !task.completed);

    // Clear current content
    this.currentDayNote = '';
    this.currentTasks = [];

    // Set reset timestamp
    this.lastDayReset = new Date().toISOString();

    // Flag for showing incomplete tasks flash
    this.showingIncompleteTasks = true;

    return this.incompleteTasks;
  },

  /**
   * Clear incomplete tasks flash
   */
  clearIncompleteTasks() {
    this.incompleteTasks = [];
    this.showingIncompleteTasks = false;
  },

  /**
   * Update task completion state
   */
  toggleTask(taskId) {
    const task = this.currentTasks.find(t => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      this.saveTaskState();
    }
  },

  /**
   * Save task state to file system (placeholder)
   */
  saveTaskState() {
    // Will be implemented with file system integration
    console.log('Saving task state:', this.currentTasks);
  },

  /**
   * Load state from localStorage
   */
  loadFromStorage() {
    try {
      const saved = localStorage.getItem('dayTimerState');
      if (saved) {
        const data = JSON.parse(saved);
        Object.assign(this, data);
      }
    } catch (err) {
      console.error('Error loading state:', err);
    }
  },

  /**
   * Save state to localStorage
   */
  saveToStorage() {
    try {
      const data = {
        folders: this.folders,
        currentFolderIndex: this.currentFolderIndex,
        lastDayReset: this.lastDayReset,
        dayResetConfig: this.dayResetConfig
      };
      localStorage.setItem('dayTimerState', JSON.stringify(data));
    } catch (err) {
      console.error('Error saving state:', err);
    }
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AppState;
}
