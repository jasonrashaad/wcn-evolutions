/**
 * Task Management
 */

const TaskManager = {
  /**
   * Create task element
   */
  createTaskElement(task) {
    const li = document.createElement('li');
    li.className = 'task-item';
    if (task.completed) {
      li.classList.add('completed');
    }
    li.dataset.taskId = task.id;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'task-checkbox';
    checkbox.checked = task.completed;
    checkbox.id = `task-${task.id}`;

    const label = document.createElement('label');
    label.htmlFor = `task-${task.id}`;
    label.className = 'task-text';
    label.textContent = task.text;

    // Event listener for checkbox
    checkbox.addEventListener('change', (e) => {
      this.toggleTask(task.id, li);
    });

    li.appendChild(checkbox);
    li.appendChild(label);

    return li;
  },

  /**
   * Toggle task completion
   */
  toggleTask(taskId, taskElement) {
    AppState.toggleTask(taskId);

    const task = AppState.currentTasks.find(t => t.id === taskId);
    if (!task) return;

    if (task.completed) {
      taskElement.classList.add('completed');
      Animations.completeTask(taskElement);
    } else {
      taskElement.classList.remove('completed');
    }
  },

  /**
   * Generate tasks from backend analysis (placeholder)
   */
  generateTasks(folderId, date) {
    // This will be implemented with backend integration
    // For now, return demo tasks
    return [
      { id: `${folderId}-task-1`, text: 'Review previous work', completed: false },
      { id: `${folderId}-task-2`, text: 'Focus on main objective', completed: false },
      { id: `${folderId}-task-3`, text: 'Document progress', completed: false }
    ];
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = TaskManager;
}
