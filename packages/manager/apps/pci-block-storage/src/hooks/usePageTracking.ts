import { useContext, useEffect } from 'react';
import { useLocation, useMatches, useRouteLoaderData } from 'react-router-dom';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { TProject } from '@ovh-ux/manager-pci-common';
import { defineCurrentPage } from '@ovh-ux/request-tagger';

const DISCOVERY_PLANCODE = 'project.discovery';

export default function usePageTracking() {
  const { shell } = useContext(ShellContext);
  const matches = useMatches();
  const { trackCurrentPage } = useOvhTracking();
  const location = useLocation();
  const project = useRouteLoaderData('public-gateway') as TProject;

  useEffect(() => {
    if (project) {
      shell.tracking.setPciProjectMode({
        projectId: project.project_id,
        isDiscoveryProject: project.planCode === DISCOVERY_PLANCODE,
      });
    }
  }, [project]);

  useEffect(() => {
    const match = matches.slice(-1);
    defineCurrentPage(`app.{{appName}}-${match[0]?.id}`);
  }, [location]);

  useEffect(() => {
    trackCurrentPage();
  }, [location]);
}
