import { useContext, useEffect } from 'react';
import { useLocation, useMatches } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useProject } from '@ovh-ux/manager-pci-common';
import { PAGE_PREFIX, PCI_LEVEL2 } from '@/tracking.constants';

const DISCOVERY_PLANCODE = 'project.discovery';

export default function usePageTracking() {
  const location = useLocation();
  const matches = useMatches();
  const { data: project } = useProject();
  const { setPciProjectMode, trackPage } = useContext(
    ShellContext,
  ).shell?.tracking || {};

  useEffect(() => {
    if (project) {
      setPciProjectMode?.({
        projectId: project.project_id,
        isDiscoveryProject: project.planCode === DISCOVERY_PLANCODE,
      });
    }
  }, [project, setPciProjectMode]);

  useEffect(() => {
    const matchedRoute = matches[matches.length - 1];

    trackPage?.({
      name: `${PAGE_PREFIX}::${matchedRoute?.id}`,
      level2: PCI_LEVEL2,
    });
  }, [location, matches, trackPage]);
}
