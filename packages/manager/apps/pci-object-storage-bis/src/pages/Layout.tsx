import { Outlet, useLocation, useParams } from 'react-router-dom';

import { Suspense, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProjectQuery } from '@ovh-ux/manager-pci-common';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import ShellRoutingSync from '@/core/ShellRoutingSync';
import HidePreloader from '@/core/HidePreloader';

export default function Layout() {
  const location = useLocation();
  const { projectId } = useParams();
  const { isSuccess } = useQuery({
    ...getProjectQuery(projectId || ''),
    ...{ retry: false, throwOnError: true },
  });
  const { trackCurrentPage } = useOvhTracking();
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
