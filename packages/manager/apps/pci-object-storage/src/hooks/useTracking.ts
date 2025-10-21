import { useLocation, useMatches, useParams } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  APP_TRACKING_PREFIX,
  PCI_LEVEL2,
} from '@/configuration/tracking.constants';
import usePciProject from '@/data/hooks/project/usePciProject.hook';
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
      name: trackingName,
      level2: PCI_LEVEL2,
    });
  };
}

// Fire a page tracking event when landing on the page
export function useTrackPage(pageTracking: string) {
  useProjectModeTracking();
  const { shell } = useContext(ShellContext);
  const { trackPage } = shell.tracking;
  useEffect(() => {
    trackPage({
      name: pageTracking,
      level2: PCI_LEVEL2,
    });
  }, []);
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
    const { id } = match;
    const routerTrackingKey = (match?.handle as { tracking: string })?.tracking;
    const suffix =
      routerTrackingKey || id || location.pathname.split('/').pop();
    let injectedTrackingKey = `${prefix}::${suffix}`;

    // replace . by ::
    injectedTrackingKey = injectedTrackingKey.replaceAll('.', '::');
    trackPage({
      name: injectedTrackingKey,
      level2: PCI_LEVEL2,
    });
    hasTrackedRef.current = true;
  }, [location.pathname, params.serviceId]);

  useEffect(() => {
    hasTrackedRef.current = false;
  }, [location.pathname]);
}
