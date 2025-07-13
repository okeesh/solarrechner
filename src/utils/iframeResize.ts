/**
 * Iframe Auto-Resize Utility
 * 
 * This utility automatically sends the height of the solar calculator app
 * to the parent window (e.g., Webflow site) using postMessage API.
 * 
 * Usage:
 * - The app is embedded in an iframe on another website
 * - This code sends { type: 'resize-calculator', height: number } messages
 * - The parent site listens for these messages and resizes the iframe accordingly
 * 
 * The height is calculated using document.documentElement.scrollHeight
 * to ensure the full content height is captured, including any overflow.
 * 
 * Messages are sent:
 * - When the page loads (after a brief delay to ensure content is rendered)
 * - When the window is resized
 * - When content changes (via MutationObserver)
 */

interface ResizeMessage {
  type: 'resize-calculator';
  height: number;
}

class IframeResizer {
  private lastHeight: number = 0;
  private observer: MutationObserver | null = null;
  private resizeTimeout: number | null = null;

  /**
   * Initialize the iframe resizer
   */
  public init(): void {
    // Only run if we're in an iframe
    if (window.parent === window) {
      console.log('Solar Calculator: Not in iframe, resize functionality disabled');
      return;
    }

    console.log('Solar Calculator: Initializing iframe auto-resize');

    // Send initial height after a brief delay to ensure content is rendered
    setTimeout(() => {
      this.sendHeight();
    }, 100);

    // Listen for window resize events
    window.addEventListener('resize', this.handleResize.bind(this));

    // Set up mutation observer to detect content changes
    this.setupMutationObserver();
  }

  /**
   * Calculate and send the current height to parent window
   */
  private sendHeight(): void {
    const height = document.documentElement.scrollHeight;
    
    // Only send if height has changed to avoid unnecessary messages
    if (height !== this.lastHeight) {
      this.lastHeight = height;
      
      const message: ResizeMessage = {
        type: 'resize-calculator',
        height: height
      };

      try {
        window.parent.postMessage(message, '*');
        console.log(`Solar Calculator: Sent height ${height}px to parent`);
      } catch (error) {
        console.error('Solar Calculator: Failed to send height to parent:', error);
      }
    }
  }

  /**
   * Handle window resize events with debouncing
   */
  private handleResize(): void {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }

    this.resizeTimeout = window.setTimeout(() => {
      this.sendHeight();
    }, 150);
  }

  /**
   * Set up MutationObserver to detect content changes
   */
  private setupMutationObserver(): void {
    // Create observer to watch for DOM changes that might affect height
    this.observer = new MutationObserver(() => {
      // Debounce the height calculation to avoid excessive calls
      if (this.resizeTimeout) {
        clearTimeout(this.resizeTimeout);
      }

      this.resizeTimeout = window.setTimeout(() => {
        this.sendHeight();
      }, 50);
    });

    // Start observing changes in the entire document
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  /**
   * Clean up event listeners and observers
   */
  public destroy(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
    
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
  }
}

// Create and export a singleton instance
export const iframeResizer = new IframeResizer();

// Export default for easy importing
export default iframeResizer; 