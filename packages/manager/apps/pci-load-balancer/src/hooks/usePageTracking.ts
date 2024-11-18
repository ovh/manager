import { useMatches } from 'react-router-dom';
import { useProject } from '@ovh-ux/manager-pci-common';
import { useContext, useEffect, useState } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { PAGE_PREFIX, PCI_LEVEL2 } from '@/tracking.constants';

const DISCOVERY_PLANCODE = 'project.discovery';

export default function usePageTracking() {
  const { data: project } = useProject();
  const { setPciProjectMode, trackPage } = useContext(
    ShellContext,
  ).shell.tracking;
  const matches = useMatches();

  // page tracking key to be send
  const [key, setKey] = useState<string>(null);

  useEffect(() => {
    // generate tracking key from route handle hierarchy
    const pageKey = matches.reduce((result, match) => {
      const tracking: string = (match.handle as { tracking?: string })
        ?.tracking;
      if (tracking) return `${result}::${tracking}`;
      return result;
    }, '');
    // avoid duplicate tracking caused by redirections
    if (pageKey !== key) setKey(pageKey);
  }, [matches, key]);

  useEffect(() => {
    if (key !== null) {
      trackPage({
        name: `${PAGE_PREFIX}::octavia-loadbalancer${key}`,
        level2: PCI_LEVEL2,
      });
    }
  }, [key]);

  useEffect(() => {
    if (project) {
      setPciProjectMode({
        projectId: project.project_id,
        isDiscoveryProject: project.planCode === DISCOVERY_PLANCODE,
      });
    }
  }, [project]);
}
