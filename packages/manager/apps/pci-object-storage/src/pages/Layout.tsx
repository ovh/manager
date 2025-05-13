import { Outlet, useParams } from 'react-router-dom';

import { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProjectQuery } from '@ovh-ux/manager-pci-common';
import ShellRoutingSync from '@/core/ShellRoutingSync';
import HidePreloader from '@/core/HidePreloader';

import usePageTracking from '@/hooks/usePageTracking';

export default function Layout() {
  const { projectId } = useParams();
  const { isSuccess } = useQuery({
    ...getProjectQuery(projectId || ''),
    ...{ retry: false, throwOnError: true },
  });

  usePageTracking();
  return (
    <div className="application">
      <Suspense>
        <ShellRoutingSync />
        {isSuccess && (
          <>
            <HidePreloader />
            <Outlet />
          </>
        )}
      </Suspense>
    </div>
  );
}
