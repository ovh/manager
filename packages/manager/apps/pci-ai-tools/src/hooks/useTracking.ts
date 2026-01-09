import { useLocation, useMatches, useParams } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';

import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import usePciProject from '@/data/hooks/project/usePciProject.hook';
import {
  APP_TRACKING_PREFIX,
  QUANTUM_APP_TRACKING_PREFIX,
  PCI_LEVEL2,
} from '@/configuration/tracking.constants';
import { PlanCode } from '@/configuration/project';
import { useQuantum } from '@/hooks/useQuantum.hook';

// Set the project mode, needed to track discovery actions
export function useProjectModeTracking() {
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

  return (trackingName: string, pageCategory?: string) => {
    trackClick({
      type: 'action',
      page_theme: 'PublicCloud',
      name: trackingName,
      level2: PCI_LEVEL2,
      page_category: pageCategory || undefined,
    });
  };
}

// Fire a page manual tracking event as page.display for toast and banner
export function useTrackBanner() {
  useProjectModeTracking();
  const { shell } = useContext(ShellContext);
  const { trackPage } = shell.tracking;

  return (trackingName: string, category?: string) => {
    trackPage({
      page_theme: 'PublicCloud',
      name: trackingName,
      page_category: category || undefined,
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
  const { isQuantum, isQpu } = useQuantum();
  // Last match is the current route, we need it
  // to get the tracking key associated with the route
  const match = matches[matches.length - 1];
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) return;
    const prefix =
      isQuantum || isQpu ? QUANTUM_APP_TRACKING_PREFIX : APP_TRACKING_PREFIX;
    const { tracking } = match.handle as {
      tracking?:
        | { id: string; category?: string }
        | ((params: {
            [key: string]: string | undefined;
          }) => {
            id: string;
            category?: string;
          });
    };
    const resolvedTracking =
      typeof tracking === 'function' ? tracking(params) : tracking;
    const { id } = match;
    const suffix =
      resolvedTracking?.id || id || location.pathname.split('/').pop();
    let injectedTrackingKey = `${prefix}::${suffix}`;

    // replace . by ::
    injectedTrackingKey = injectedTrackingKey.replaceAll('.', '::');
    trackPage({
      page_theme: 'PublicCloud',
      name: injectedTrackingKey,
      level2: PCI_LEVEL2,
      page_category: resolvedTracking?.category || undefined,
    });
    hasTrackedRef.current = true;
  }, [location.pathname, params.serviceId]);

  useEffect(() => {
    hasTrackedRef.current = false;
  }, [location.pathname]);
}
