import { Outlet, useLocation, useParams } from 'react-router-dom';

import { useProject } from '@ovh-ux/manager-pci-common';
import { Suspense, useEffect } from 'react';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import HidePreloader from '@/core/HidePreloader';
import ShellRoutingSync from '@/core/ShellRoutingSync';

export default function Layout() {
  const location = useLocation();
  const { trackCurrentPage } = useOvhTracking();

  const { projectId } = useParams();
  const { isSuccess } = useProject(projectId || '', { retry: false });

  useEffect(() => {
    trackCurrentPage();
  }, [location]);

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
