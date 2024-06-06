import { useContext, useEffect } from 'react';
import { useLocation, useRouteLoaderData } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { PublicCloudProject } from '@ovhcloud/manager-components';
import { PAGE_PREFIX, PCI_LEVEL2 } from '@/tracking.constants';

const DISCOVERY_PLANCODE = 'project.discovery';

export default function usePageTracking() {
  const location = useLocation();
  const project = useRouteLoaderData('public-gateway') as PublicCloudProject;
  const { setPciProjectMode, trackPage } = useContext(
    ShellContext,
  ).shell.tracking;

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
    const pageKey = pageId === 'blocks' ? '' : `::${pageId}`;
    trackPage({
      name: `${PAGE_PREFIX}::storages::blocks${pageKey}`,
      level2: PCI_LEVEL2,
    });
  }, [location]);
}
