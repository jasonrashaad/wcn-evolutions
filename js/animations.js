/**
 * GSAP Animations
 */

const Animations = {
  /**
   * Folder open animation sequence
   * @param {HTMLElement} folderElement - The folder cover element
   * @param {Function} onComplete - Callback when animation completes
   */
  openFolder(folderElement, onComplete) {
    const timeline = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
        AppState.isAnimating = false;
      }
    });

    AppState.isAnimating = true;

    // Get folder position and dimensions
    const rect = folderElement.getBoundingClientRect();
    const centerX = window.innerWidth / 2 - rect.left - rect.width / 2;
    const centerY = window.innerHeight / 2 - rect.top - rect.height / 2;

    timeline
      // 1. Lift folder
      .to(folderElement, {
        duration: 0.3,
        z: 100,
        scale: 1.05,
        boxShadow: '0 40px 100px rgba(0, 0, 0, 0.5)',
        ease: 'power2.out'
      })
      // 2. Move to center and rotate
      .to(folderElement, {
        duration: 0.4,
        x: centerX,
        y: centerY,
        rotateY: -5,
        ease: 'power2.inOut'
      })
      // 3. Expand to full screen
      .to(folderElement, {
        duration: 0.5,
        scale: 2,
        rotateY: 0,
        opacity: 0,
        ease: 'power2.inOut'
      })
      // 4. Fade out browse view
      .to('#browse-view', {
        duration: 0.3,
        opacity: 0,
        ease: 'power2.inOut'
      }, '-=0.3')
      // 5. Show working view
      .set('#browse-view', { className: 'view' })
      .set('#working-view', { className: 'view active' })
      .from('#working-view', {
        duration: 0.4,
        opacity: 0,
        ease: 'power2.out'
      })
      // 6. Reveal content sections with stagger
      .from('.content-section', {
        duration: CONFIG.animations.sectionReveal,
        opacity: 0,
        y: 20,
        stagger: 0.1,
        ease: 'power2.out'
      }, '-=0.2');

    return timeline;
  },

  /**
   * Folder close animation sequence
   * @param {Function} onComplete - Callback when animation completes
   */
  closeFolder(onComplete) {
    const timeline = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
        AppState.isAnimating = false;
      }
    });

    AppState.isAnimating = true;

    timeline
      // 1. Fade out working view
      .to('#working-view', {
        duration: 0.3,
        opacity: 0,
        ease: 'power2.inOut'
      })
      // 2. Switch views
      .set('#working-view', { className: 'view' })
      .set('#browse-view', { className: 'view active' })
      // 3. Fade in browse view
      .from('#browse-view', {
        duration: 0.5,
        opacity: 0,
        ease: 'power2.out'
      })
      // 4. Animate folder back into position
      .from('.folder-cover', {
        duration: 0.6,
        scale: 2,
        opacity: 0,
        ease: 'back.out(1.2)'
      }, '-=0.3');

    return timeline;
  },

  /**
   * Day reset page tear animation
   * @param {Function} onComplete - Callback when animation completes
   */
  pageTear(onComplete) {
    const timeline = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
        AppState.isAnimating = false;
      }
    });

    AppState.isAnimating = true;

    const writingSection = document.querySelector('.writing-section');

    timeline
      // 1. Tear effect on writing section
      .to(writingSection, {
        duration: 0.3,
        rotateX: -10,
        skewY: 2,
        transformOrigin: 'top center',
        ease: 'power2.in'
      })
      .to(writingSection, {
        duration: 0.3,
        y: -50,
        opacity: 0,
        ease: 'power2.in'
      })
      // 2. Reset position and fade back in
      .set(writingSection, { rotateX: 0, skewY: 0, y: 0 })
      .to(writingSection, {
        duration: 0.4,
        opacity: 1,
        ease: 'power2.out'
      });

    return timeline;
  },

  /**
   * Incomplete tasks flash animation
   * @param {HTMLElement[]} taskElements - Array of task elements
   * @param {Function} onComplete - Callback when animation completes
   */
  incompleteTasksFlash(taskElements, onComplete) {
    const timeline = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    if (taskElements.length === 0) {
      if (onComplete) onComplete();
      return timeline;
    }

    timeline
      // 1. Flash red
      .from(taskElements, {
        duration: 0.3,
        backgroundColor: '#FF4444',
        color: '#FFFFFF',
        scale: 1.02,
        stagger: 0.05,
        ease: 'power2.out'
      })
      // 2. Hold for a moment
      .to({}, { duration: 1.0 })
      // 3. Fade out
      .to(taskElements, {
        duration: 0.6,
        opacity: 0,
        y: -10,
        stagger: 0.05,
        ease: 'power2.in'
      });

    return timeline;
  },

  /**
   * Task completion animation
   * @param {HTMLElement} taskElement - The task element
   * @param {Function} onComplete - Callback when animation completes
   */
  completeTask(taskElement, onComplete) {
    const timeline = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      }
    });

    const checkbox = taskElement.querySelector('.task-checkbox');
    const text = taskElement.querySelector('.task-text');

    timeline
      // 1. Checkbox scale
      .to(checkbox, {
        duration: 0.2,
        scale: 1.3,
        ease: 'back.out(3)'
      })
      .to(checkbox, {
        duration: 0.2,
        scale: 1,
        ease: 'power2.out'
      })
      // 2. Text line-through with slide
      .to(text, {
        duration: 0.3,
        opacity: 0.6,
        ease: 'power2.out'
      }, '-=0.2')
      // 3. Subtle celebration
      .to(taskElement, {
        duration: 0.3,
        backgroundColor: 'rgba(74, 124, 89, 0.1)',
        ease: 'power2.out'
      })
      .to(taskElement, {
        duration: 0.5,
        backgroundColor: 'transparent',
        ease: 'power2.out'
      });

    return timeline;
  },

  /**
   * Browse view folder navigation (flip to next/previous)
   * @param {String} direction - 'next' or 'prev'
   * @param {Function} onComplete - Callback when animation completes
   */
  flipFolder(direction, onComplete) {
    const timeline = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
        AppState.isAnimating = false;
      }
    });

    AppState.isAnimating = true;

    const currentFolder = document.querySelector('.folder-cover');
    const rotation = direction === 'next' ? -90 : 90;

    timeline
      // Flip current folder out
      .to(currentFolder, {
        duration: 0.4,
        rotateY: rotation,
        opacity: 0,
        scale: 0.8,
        ease: 'power2.inOut'
      })
      // Update folder content happens in callback
      .call(() => {
        if (onComplete) onComplete();
      })
      // Flip new folder in
      .from(currentFolder, {
        duration: 0.4,
        rotateY: -rotation,
        opacity: 0,
        scale: 0.8,
        ease: 'power2.out'
      });

    return timeline;
  },

  /**
   * Section reveal animation (for dynamic content)
   * @param {HTMLElement} element - Element to reveal
   * @param {Function} onComplete - Callback when animation completes
   */
  revealSection(element, onComplete) {
    return gsap.from(element, {
      duration: CONFIG.animations.sectionReveal,
      opacity: 0,
      y: 20,
      ease: 'power2.out',
      onComplete
    });
  },

  /**
   * Loading state animation
   * @param {HTMLElement} element - Element to animate
   */
  showLoading(element) {
    return gsap.to(element, {
      duration: 0.3,
      opacity: 0.5,
      pointerEvents: 'none',
      ease: 'power2.out'
    });
  },

  /**
   * Remove loading state
   * @param {HTMLElement} element - Element to animate
   */
  hideLoading(element) {
    return gsap.to(element, {
      duration: 0.3,
      opacity: 1,
      pointerEvents: 'auto',
      ease: 'power2.out'
    });
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Animations;
}
