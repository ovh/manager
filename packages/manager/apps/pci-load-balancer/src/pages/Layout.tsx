import { Outlet, useParams } from 'react-router-dom';

import { useProject } from '@ovh-ux/manager-pci-common';
import { Suspense } from 'react';
import HidePreloader from '@/core/HidePreloader';
import ShellRoutingSync from '@/core/ShellRoutingSync';

import usePageTracking from '@/hooks/usePageTracking';

export default function Layout() {
  const { projectId } = useParams();
  const { isSuccess } = useProject(projectId || '', { retry: false });

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
