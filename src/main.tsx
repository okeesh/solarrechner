import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import './styles/fonts.css';
import iframeResizer from './utils/iframeResize';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Initialize iframe auto-resize functionality after the React app is rendered
// This ensures the DOM is ready and the calculator content is loaded
setTimeout(() => {
  iframeResizer.init();
}, 0);
