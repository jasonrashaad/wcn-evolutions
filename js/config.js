/**
 * Application Configuration
 */

const CONFIG = {
  // Vault configuration
  vault: {
    basePath: './vault', // Will be configurable by user
    structure: {
      dailyNotes: 'daily-notes',
      tasks: 'tasks',
      supportive: 'supportive',
      config: 'config.json'
    }
  },

  // Day reset configuration defaults
  dayReset: {
    types: ['calendar', 'time', 'custom'],
    defaultType: 'calendar',
    defaultTime: '00:00'
  },

  // Animation durations (in seconds)
  animations: {
    folderOpen: 1.2,
    folderClose: 0.8,
    pageTear: 0.6,
    taskComplete: 0.4,
    incompleteFlash: 2.0,
    sectionReveal: 0.3
  },

  // UI settings
  ui: {
    autoSaveDelay: 2000, // ms
    maxFolders: 10,
    defaultFolderColors: [
      '#2E5C8A', // blue
      '#C84630', // red
      '#F4B942', // yellow
      '#4A7C59', // green
      '#6B4E9E'  // purple
    ]
  },

  // Demo data (for initial development)
  demo: {
    enabled: true,
    folders: [
      {
        id: 'demo-goal-1',
        title: 'Writing Project',
        description: 'Finish the first draft',
        color: '#2E5C8A',
        dayResetType: 'calendar'
      },
      {
        id: 'demo-goal-2',
        title: 'Fitness Goal',
        description: 'Get stronger, feel better',
        color: '#4A7C59',
        dayResetType: 'time',
        resetTime: '06:00'
      },
      {
        id: 'demo-goal-3',
        title: 'Learn Spanish',
        description: 'Practice every day',
        color: '#6B4E9E',
        dayResetType: 'calendar'
      }
    ]
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIG;
}
