import { useContext, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { useProject } from '@ovh-ux/manager-pci-common';
import { PAGE_PREFIX, PCI_LEVEL2 } from '@/tracking.constants';

const DISCOVERY_PLANCODE = 'project.discovery';

export default function usePageTracking() {
  const location = useLocation();
  const { projectId } = useParams();
  const { data: project } = useProject(projectId || '', { retry: false });
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
    const pageKey = pageId === 'private-registry' ? '' : `::${pageId}`;
    trackPage({
      name: `${PAGE_PREFIX}::private-registry${pageKey}`,
      level2: PCI_LEVEL2,
    });
  }, [location]);
}
