/**
 * File System Integration
 * Handles reading/writing to Obsidian vault
 */

const FileSystem = {
  // File handles (for File System Access API)
  directoryHandle: null,
  vaultPath: null,

  /**
   * Initialize file system access
   */
  async init() {
    // Check if File System Access API is available
    if ('showDirectoryPicker' in window) {
      console.log('File System Access API available');
      // Will prompt user to select vault directory
    } else {
      console.warn('File System Access API not available, using localStorage fallback');
      this.initLocalStorageFallback();
    }
  },

  /**
   * Request vault directory access from user
   */
  async requestVaultAccess() {
    try {
      this.directoryHandle = await window.showDirectoryPicker({
        mode: 'readwrite'
      });
      this.vaultPath = this.directoryHandle.name;
      console.log('Vault access granted:', this.vaultPath);
      return true;
    } catch (err) {
      console.error('Vault access denied:', err);
      return false;
    }
  },

  /**
   * Read markdown file
   */
  async readMarkdownFile(filePath) {
    if (this.directoryHandle) {
      return await this.readFileFromFileSystem(filePath);
    } else {
      return this.readFileFromLocalStorage(filePath);
    }
  },

  /**
   * Write markdown file
   */
  async writeMarkdownFile(filePath, content) {
    if (this.directoryHandle) {
      return await this.writeFileToFileSystem(filePath, content);
    } else {
      return this.writeFileToLocalStorage(filePath, content);
    }
  },

  /**
   * Read JSON file
   */
  async readJSONFile(filePath) {
    const content = await this.readMarkdownFile(filePath);
    try {
      return JSON.parse(content);
    } catch (err) {
      console.error('Error parsing JSON:', err);
      return null;
    }
  },

  /**
   * Write JSON file
   */
  async writeJSONFile(filePath, data) {
    const content = JSON.stringify(data, null, 2);
    return await this.writeMarkdownFile(filePath, content);
  },

  /**
   * Read file from File System Access API
   */
  async readFileFromFileSystem(filePath) {
    try {
      const pathParts = filePath.split('/');
      let currentHandle = this.directoryHandle;

      // Navigate directory structure
      for (let i = 0; i < pathParts.length - 1; i++) {
        currentHandle = await currentHandle.getDirectoryHandle(pathParts[i], { create: false });
      }

      // Get file
      const fileName = pathParts[pathParts.length - 1];
      const fileHandle = await currentHandle.getFileHandle(fileName, { create: false });
      const file = await fileHandle.getFile();
      const content = await file.text();

      return content;
    } catch (err) {
      console.error('Error reading file:', filePath, err);
      return null;
    }
  },

  /**
   * Write file to File System Access API
   */
  async writeFileToFileSystem(filePath, content) {
    try {
      const pathParts = filePath.split('/');
      let currentHandle = this.directoryHandle;

      // Navigate/create directory structure
      for (let i = 0; i < pathParts.length - 1; i++) {
        currentHandle = await currentHandle.getDirectoryHandle(pathParts[i], { create: true });
      }

      // Create/update file
      const fileName = pathParts[pathParts.length - 1];
      const fileHandle = await currentHandle.getFileHandle(fileName, { create: true });
      const writable = await fileHandle.createWritable();
      await writable.write(content);
      await writable.close();

      return true;
    } catch (err) {
      console.error('Error writing file:', filePath, err);
      return false;
    }
  },

  /**
   * Initialize localStorage fallback
   */
  initLocalStorageFallback() {
    console.log('Using localStorage for file operations');
    this.vaultPath = 'localStorage';
  },

  /**
   * Read file from localStorage
   */
  readFileFromLocalStorage(filePath) {
    const key = `vault:${filePath}`;
    return localStorage.getItem(key) || '';
  },

  /**
   * Write file to localStorage
   */
  writeFileToLocalStorage(filePath, content) {
    const key = `vault:${filePath}`;
    localStorage.setItem(key, content);
    return true;
  },

  /**
   * Get file path for daily note
   */
  getDailyNotePath(folderId, date) {
    const dateStr = this.formatDate(date);
    return `${folderId}/${dateStr}.md`;
  },

  /**
   * Get file path for supportive daily note
   */
  getSupportiveNotePath(folderId, date) {
    const dateStr = this.formatDate(date);
    return `${folderId}/${CONFIG.vault.structure.dailyNotes}/${dateStr}.md`;
  },

  /**
   * Get file path for tasks
   */
  getTasksPath(folderId, date) {
    const dateStr = this.formatDate(date);
    return `${folderId}/${CONFIG.vault.structure.tasks}/${dateStr}.json`;
  },

  /**
   * Format date as YYYY-MM-DD
   */
  formatDate(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  /**
   * Save writing area content
   */
  async saveWritingArea(folderId, date, content) {
    const filePath = this.getDailyNotePath(folderId, date);
    return await this.writeMarkdownFile(filePath, content);
  },

  /**
   * Load writing area content
   */
  async loadWritingArea(folderId, date) {
    const filePath = this.getDailyNotePath(folderId, date);
    return await this.readMarkdownFile(filePath);
  },

  /**
   * Load supportive note
   */
  async loadSupportiveNote(folderId, date) {
    const filePath = this.getSupportiveNotePath(folderId, date);
    return await this.readMarkdownFile(filePath);
  },

  /**
   * Save task state
   */
  async saveTaskState(folderId, date, tasks) {
    const filePath = this.getTasksPath(folderId, date);
    return await this.writeJSONFile(filePath, tasks);
  },

  /**
   * Load task state
   */
  async loadTaskState(folderId, date) {
    const filePath = this.getTasksPath(folderId, date);
    return await this.readJSONFile(filePath);
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = FileSystem;
}
