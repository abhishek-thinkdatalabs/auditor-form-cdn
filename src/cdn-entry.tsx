import React from 'react';
import ReactDOM from 'react-dom'; // <-- react-dom (not /client)
import AuditorForm from '../app/components/AuditorForm';
import '../app/globals.css';

export { AuditorForm };

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeForm);
  } else {
    initializeForm();
  }
}

function initializeForm() {
  const containers = document.querySelectorAll('[data-auditor-form]');
  
  containers.forEach((container) => {
    if (container && !container.hasAttribute('data-auditor-form-initialized')) {
      ReactDOM.render(React.createElement(AuditorForm), container);
      container.setAttribute('data-auditor-form-initialized', 'true');
    }
  });
}

(window as any).AuditorForm = {
  init: (containerId: string) => {
    const container = document.getElementById(containerId);
    if (container) {
      ReactDOM.render(React.createElement(AuditorForm), container);
    }
  },
  Component: AuditorForm
};
