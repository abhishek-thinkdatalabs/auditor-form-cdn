import React from 'react';
import * as ReactDOM from 'react-dom'; // Import everything from react-dom for global fallback
import AuditorForm from '../app/components/AuditorForm';
import '../app/globals.css';

// Export the component for UMD
export { AuditorForm };

// Utility: render component with React 18 or fallback to React 17
function renderComponent(container: HTMLElement, component: React.ReactNode) {
  // @ts-ignore
  if (ReactDOM.createRoot) {
    // React 18+
    // @ts-ignore
    ReactDOM.createRoot(container).render(component);
  } else if ((ReactDOM as any).render) {
    // React 17 fallback
    (ReactDOM as any).render(component, container);
  } else {
    console.error('ReactDOM not found. Please include React and ReactDOM on the page.');
  }
}

// Auto-initialize forms with data attribute
function initializeForm() {
  const containers = document.querySelectorAll('[data-auditor-form]');
  
  containers.forEach((container) => {
    if (container && !container.hasAttribute('data-auditor-form-initialized')) {
      renderComponent(container as HTMLElement, React.createElement(AuditorForm));
      container.setAttribute('data-auditor-form-initialized', 'true');
    }
  });
}

// Auto-init if loaded directly in browser
if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeForm);
  } else {
    initializeForm();
  }
}

// Expose global init function for manual initialization
(window as any).AuditorForm = {
  init: (containerId: string) => {
    const container = document.getElementById(containerId);
    if (container) {
      renderComponent(container, React.createElement(AuditorForm));
    } else {
      console.warn(`Container with id "${containerId}" not found`);
    }
  },
  Component: AuditorForm
};
