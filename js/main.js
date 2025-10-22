/**
 * Main Application Entry Point
 */

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  console.log('Day Timer initializing...');

  try {
    // Initialize modules
    await FileSystem.init();
    AppState.init();
    Views.init();

    console.log('Day Timer ready!');
    console.log('Current view:', AppState.currentView);
    console.log('Folders loaded:', AppState.folders.length);

    // Optional: Prompt for vault access on first run
    // Uncomment when ready to test file system integration
    // const hasAccess = await FileSystem.requestVaultAccess();
    // if (!hasAccess) {
    //   console.warn('Vault access not granted, using demo mode');
    // }

  } catch (err) {
    console.error('Error initializing application:', err);
    showError('Failed to initialize application. Please refresh the page.');
  }
});

/**
 * Show error message to user
 */
function showError(message) {
  const errorDiv = document.createElement('div');
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: #C84630;
    color: white;
    padding: 1rem 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    z-index: 1000;
    font-family: var(--font-primary);
  `;
  errorDiv.textContent = message;
  document.body.appendChild(errorDiv);

  setTimeout(() => {
    errorDiv.remove();
  }, 5000);
}

/**
 * Handle window resize
 */
window.addEventListener('resize', () => {
  // Refresh current view if needed
  if (AppState.currentView === 'browse') {
    Views.updateFolderVisibility();
  }
});

/**
 * Handle before unload (save state)
 */
window.addEventListener('beforeunload', () => {
  if (AppState.openFolder && AppState.currentDayNote) {
    Views.saveWriting();
  }
  AppState.saveToStorage();
});

/**
 * Keyboard shortcuts
 */
document.addEventListener('keydown', (e) => {
  // Only handle shortcuts when not typing in textarea
  if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
    return;
  }

  // Escape key: Close folder if in working view
  if (e.key === 'Escape' && AppState.currentView === 'working' && !AppState.isAnimating) {
    Views.closeFolder();
  }

  // Arrow keys: Navigate folders in browse view
  if (AppState.currentView === 'browse' && !AppState.isAnimating) {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      Views.navigateFolders('prev');
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      Views.navigateFolders('next');
    }
  }

  // Ctrl/Cmd + N: New day reset
  if ((e.ctrlKey || e.metaKey) && e.key === 'n' && AppState.currentView === 'working') {
    e.preventDefault();
    Views.triggerDayReset();
  }
});

console.log('Day Timer loaded');
