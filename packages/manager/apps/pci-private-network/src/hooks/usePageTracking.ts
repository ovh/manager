import { useContext, useEffect } from 'react';
import { useLocation, useMatches, useRouteLoaderData } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { TProject } from '@ovh-ux/manager-pci-common';
import { PAGE_PREFIX, PCI_LEVEL2 } from '@/tracking.constants';
import { RouteHandle } from '@/routes';

const DISCOVERY_PLANCODE = 'project.discovery';

export default function usePageTracking() {
  const location = useLocation();
  const project = useRouteLoaderData('private-networks') as TProject;
  const { setPciProjectMode, trackPage } = useContext(
    ShellContext,
  ).shell.tracking;
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
      name: `${PAGE_PREFIX}::privateNetwork${
        pageId === 'private-networks' ? '' : `::${pageId}`
      }`,
      level2: PCI_LEVEL2,
    });
  }, [location]);
}
