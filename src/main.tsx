import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import './styles/fonts.css';
import iframeResizer from './utils/iframeResize';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)

// Initialize iframe auto-resize functionality after the React app is rendered
// This ensures the DOM is ready and the calculator content is loaded
setTimeout(() => {
  iframeResizer.init();
}, 0);
