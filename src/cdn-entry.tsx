import React from 'react';
import ReactDOM from 'react-dom'; // use react-dom
import AuditorForm from '../app/components/AuditorForm';
import '../app/globals.css';

export { AuditorForm };

function renderComponent(container: HTMLElement) {
  ReactDOM.render(React.createElement(AuditorForm), container);
}

function initializeForm() {
  const containers = document.querySelectorAll('[data-auditor-form]');
  containers.forEach((container) => {
    if (!container.hasAttribute('data-auditor-form-initialized')) {
      renderComponent(container as HTMLElement);
      container.setAttribute('data-auditor-form-initialized', 'true');
    }
  });
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeForm);
  } else {
    initializeForm();
  }
}

(window as any).AuditorForm = {
  init: (containerId: string) => {
    const container = document.getElementById(containerId);
    if (container) renderComponent(container);
  },
  Component: AuditorForm
};
