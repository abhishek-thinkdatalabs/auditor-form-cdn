import React from 'react';
import ReactDOM from 'react-dom/client';
import AuditorForm from '../app/components/AuditorForm';
import '../app/globals.css';

// Export the component for UMD
export { AuditorForm };

// Auto-initialize if script is loaded directly
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeForm);
  } else {
    initializeForm();
  }
}

function initializeForm() {
  // Look for elements with data-auditor-form attribute
  const containers = document.querySelectorAll('[data-auditor-form]');
  
  containers.forEach((container) => {
    if (container && !container.hasAttribute('data-auditor-form-initialized')) {
      const root = ReactDOM.createRoot(container as HTMLElement);
      root.render(React.createElement(AuditorForm));
      container.setAttribute('data-auditor-form-initialized', 'true');
    }
  });
}

// Also expose a global function for manual initialization
(window as any).AuditorForm = {
  init: (containerId: string) => {
    const container = document.getElementById(containerId);
    if (container) {
      const root = ReactDOM.createRoot(container);
      root.render(React.createElement(AuditorForm));
    }
  },
  Component: AuditorForm
};
