import { useEffect } from 'react';
import { useLocation, useRouteLoaderData } from 'react-router-dom';
import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { Project } from '@/api/data/project';

import {
  PAGE_PREFIX,
  PCI_LEVEL2,
  DISCOVERY_PLANCODE,
} from '@/tracking.constants';

interface PageTrackingProps {
  mapping?: Record<string, string>;
}

export default function usePageTracking(opts: PageTrackingProps) {
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
    let pageId = location.pathname.split('/').pop();
    if (opts.mapping && pageId in opts.mapping) {
      pageId = opts.mapping[pageId];
    }
    trackPage({
      name: `${PAGE_PREFIX}::users${pageId === 'users' ? '' : `::${pageId}`}`,
      level2: PCI_LEVEL2,
    });
  }, [location]);
}
