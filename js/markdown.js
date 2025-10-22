/**
 * Markdown Rendering
 * Simple markdown renderer (will be replaced with library like marked.js or markdown-it)
 */

const MarkdownRenderer = {
  /**
   * Render markdown to HTML
   * Basic implementation - will be enhanced with proper markdown library
   */
  render(markdown) {
    if (!markdown) return '';

    let html = markdown;

    // Basic markdown parsing (simplified)
    // Headers
    html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/gim, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/gim, '<em>$1</em>');
    html = html.replace(/_(.*?)_/gim, '<em>$1</em>');

    // Links
    html = html.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" target="_blank">$1</a>');

    // Line breaks
    html = html.replace(/\n/gim, '<br>');

    // Paragraphs (basic)
    html = html.replace(/(<br>){2,}/gim, '</p><p>');
    html = `<p>${html}</p>`;

    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/gim, '');
    html = html.replace(/<p><br>/gim, '<p>');

    return html;
  },

  /**
   * Sanitize HTML to prevent XSS
   * Basic implementation - should use DOMPurify or similar in production
   */
  sanitize(html) {
    const temp = document.createElement('div');
    temp.textContent = html;
    return temp.innerHTML;
  },

  /**
   * Parse markdown file content
   */
  parse(fileContent) {
    // Will handle frontmatter, metadata, etc.
    return {
      content: fileContent,
      metadata: {}
    };
  }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MarkdownRenderer;
}
