import { useLocation, useMatches, useParams } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import usePciProject from '@/data/hooks/project/usePciProject.hook';
import {
  APP_TRACKING_PREFIX,
  PCI_LEVEL2,
} from '@/configuration/tracking.constants';
import { PlanCode } from '@/configuration/project';

// Set the project mode, needed to track discovery actions
function useProjectModeTracking() {
  const { shell } = useContext(ShellContext);
  const { setPciProjectMode } = shell.tracking;
  const { data: project } = usePciProject();
  useEffect(() => {
    if (project) {
      setPciProjectMode({
        projectId: project.project_id,
        isDiscoveryProject: project.planCode === PlanCode.DISCOVERY,
      });
    }
  }, [project]);
}

// Provide a function to track actions with the correct
// type and level
export function useTrackAction() {
  useProjectModeTracking();
  const { shell } = useContext(ShellContext);
  const { trackClick } = shell.tracking;

  return (trackingName: string) => {
    trackClick({
      type: 'action',
      page_theme: 'PublicCloud',
      name: trackingName,
      level2: PCI_LEVEL2,
    });
  };
}

// Fire a page manual tracking event as page.display for toast and banner
export function useTrackBanner() {
  useProjectModeTracking();
  const { shell } = useContext(ShellContext);
  const { trackPage } = shell.tracking;

  return (trackingName: string) => {
    trackPage({
      page_theme: 'PublicCloud',
      name: trackingName,
      level2: PCI_LEVEL2,
    });
  };
}

export function useTrackPageAuto() {
  useProjectModeTracking();
  const { shell } = useContext(ShellContext);
  const { trackPage } = shell.tracking;
  const matches = useMatches();
  const location = useLocation();
  const params = useParams();
  // Last match is the current route, we need it
  // to get the tracking key associated with the route
  const match = matches[matches.length - 1];
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) return;
    const prefix = APP_TRACKING_PREFIX;
    const { tracking } = match.handle as {
      tracking?: { id: string; category?: string };
    };
    const { id } = match;
    const suffix = tracking.id || id || location.pathname.split('/').pop();
    let injectedTrackingKey = `${prefix}::${suffix}`;

    // replace . by ::
    injectedTrackingKey = injectedTrackingKey.replaceAll('.', '::');
    trackPage({
      page_theme: 'PublicCloud',
      name: injectedTrackingKey,
      level2: PCI_LEVEL2,
      page_category: tracking.category || undefined,
    });
    hasTrackedRef.current = true;
  }, [location.pathname, params.serviceId]);

  useEffect(() => {
    hasTrackedRef.current = false;
  }, [location.pathname]);
}
