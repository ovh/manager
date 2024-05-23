import { useEffect } from 'react';
import { useLocation, useMatches, useRouteLoaderData } from 'react-router-dom';
import { useTracking } from '@ovh-ux/manager-react-shell-client';

import { PAGE_PREFIX, PCI_LEVEL2 } from '@/tracking.constants';
import { Project } from '@/api/data/project';
import { RouteHandle } from '@/routes';

const DISCOVERY_PLANCODE = 'project.discovery';

export default function usePageTracking() {
  const location = useLocation();
  const project = useRouteLoaderData('public-ips') as Project;
  const { setPciProjectMode, trackPage } = useTracking();
  const handle = useMatches().slice(-1)[0]?.handle as RouteHandle;

  useEffect(() => {
    if (project) {
      setPciProjectMode({
        projectId: project.project_id,
        isDiscoveryProject: project.planCode === DISCOVERY_PLANCODE,
      });
    }
  }, [project]);

  useEffect(() => {
    const pageId = handle?.tracking || location.pathname.split('/').pop();
    trackPage({
      name: `${PAGE_PREFIX}::additional-ips${
        pageId === 'public-ips' ? '' : `::${pageId}`
      }`,
      level2: PCI_LEVEL2,
    });
  }, [location]);
}
