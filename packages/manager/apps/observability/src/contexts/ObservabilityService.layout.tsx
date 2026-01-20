import { Outlet } from 'react-router-dom';

import { ObservabilityServiceProvider } from '@/contexts/ObservabilityService.context';

export default function MetricsLayout() {
  return (
    <ObservabilityServiceProvider>
      <Outlet />
    </ObservabilityServiceProvider>
  );
}
