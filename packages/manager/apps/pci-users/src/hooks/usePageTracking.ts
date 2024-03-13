import { useEffect } from 'react';
import { useLocation, useRouteLoaderData } from 'react-router-dom';
import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { Project } from '@/data/project';

import {
  PAGE_PREFIX,
  PCI_LEVEL2,
  DISCOVERY_PLANCODE,
} from '@/tracking.constants';

export default function usePageTracking() {
  const location = useLocation();
  const project = useRouteLoaderData('ssh') as Project;
  const { setPciProjectMode, trackPage } = useTracking();

  useEffect(() => {
    if (project) {
      setPciProjectMode({
        projectId: project.project_id,
        isDiscoveryProject: project.planCode === DISCOVERY_PLANCODE,
      });
    }
  }, [project]);

  useEffect(() => {
    const pageId = location.pathname.split('/').pop();
    trackPage({
      name: `${PAGE_PREFIX}::users${pageId === 'users' ? '' : `::${pageId}`}`,
      level2: PCI_LEVEL2,
    });
  }, [location]);
}
