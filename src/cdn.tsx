import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuditorForm from './components/AuditorForm';
import { ToastProvider } from './components/Toast';
import type { AuditorFormConfig } from './types';
import './index.css';

// Create a global function to initialize the form
declare global {
  interface Window {
    initAuditorForm: (containerId: string, config?: AuditorFormConfig) => void;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000, // 5 minutes
      retry: 2,
    },
  },
});

window.initAuditorForm = (containerId: string, config: AuditorFormConfig = {}) => {
  const container = document.getElementById(containerId);
  
  if (!container) {
    console.error(`Container with ID "${containerId}" not found`);
    return;
  }

  const root = createRoot(container);
  
  root.render(
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuditorForm config={config} />
      </ToastProvider>
    </QueryClientProvider>
  );
};

// For development mode
if (import.meta.env.DEV) {
  window.initAuditorForm('root', {
    apiUrl: 'https://crmapi.thinkdatalabs.com/api',
    apiHeaders: {
      'x-access-api-key': 'c8020ac4ad9745fa6e0a8deaccc4ba5c525f58dbf85a01de9dc0f50c9e1a15ae',
      'x-public-api-key': '282af17a9b504ce038cd37cc6e91127b'
    },
    recaptchaSiteKey: '6LcKXbIqAAAAAPhuxH6QqcXURTo77hkvyWP10Bdf'
  });
}