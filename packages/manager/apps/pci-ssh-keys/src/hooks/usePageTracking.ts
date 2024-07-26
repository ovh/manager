import { useEffect } from 'react';
import { useLocation, useRouteLoaderData } from 'react-router-dom';
import { useTracking } from '@ovh-ux/manager-react-shell-client';
import { Project } from '@/api/data/project';

import { PAGE_PREFIX, PCI_LEVEL2 } from '@/tracking.constants';

const DISCOVERY_PLANCODE = 'project.discovery';

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
    const pageKey = pageId === 'ssh' ? '' : `::${pageId}`;
    trackPage({
      name: `${PAGE_PREFIX}::sshKeys${pageKey}`,
      level2: PCI_LEVEL2,
    });
  }, [location]);
}
