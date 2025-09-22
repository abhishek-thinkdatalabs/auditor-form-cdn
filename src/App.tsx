import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuditorForm from './components/AuditorForm';
import { ToastProvider } from './components/Toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
      retry: 2,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuditorForm 
          config={{
            apiUrl: 'https://crmapi.thinkdatalabs.com/api',
            apiHeaders: {
              'x-access-api-key': 'c8020ac4ad9745fa6e0a8deaccc4ba5c525f58dbf85a01de9dc0f50c9e1a15ae',
              'x-public-api-key': '282af17a9b504ce038cd37cc6e91127b'
            },
            recaptchaSiteKey: '6LcKXbIqAAAAAPhuxH6QqcXURTo77hkvyWP10Bdf'
          }}
        />
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;