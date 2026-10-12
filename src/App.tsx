import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useDatasetStore } from './store/useDatasetStore';
import { UploadPage } from './pages/UploadPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { MobileAdvisoryPage } from './pages/MobileAdvisoryPage';
import { useIsMobile } from './hooks/useIsMobile';

// Configure TanStack React Query Client with 5 minutes staleTime
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes cache
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const AppContent: React.FC = () => {
  const dataset = useDatasetStore((state) => state.dataset);
  const [proceedOnMobile, setProceedOnMobile] = useState(false);
  const isMobile = useIsMobile(1024);

  // Reset mobile override whenever a dataset is unloaded / reset
  useEffect(() => {
    if (!dataset) {
      setProceedOnMobile(false);
    }
  }, [dataset]);

  // 1. Initial State: Landing page & upload available on all viewports (mobile & desktop)
  if (!dataset) {
    return <UploadPage />;
  }

  // 2. Post-Upload Mobile Advisory: If in mobile view, guide user that desktop is recommended
  if (isMobile && !proceedOnMobile) {
    return (
      <MobileAdvisoryPage
        dataset={dataset}
        onProceedAnyway={() => setProceedOnMobile(true)}
      />
    );
  }

  // 3. Playground: Rendered directly on desktop, or if user explicitly chose to continue on mobile
  return <PlaygroundPage />;
};

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;

