import { useLocation, useMatches, useParams } from 'react-router-dom';
import { useContext, useEffect, useRef } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import usePciProject from './api/project/usePciProject.hook';
import { PCI_LEVEL2 } from '@/configuration/tracking.constants';
import { PlanCode } from '@/types/cloud/Project';
import { useGetService } from './api/database/service/useGetService.hook';

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
  const serviceQuery = useGetService(
    match.params.projectId,
    match.params.serviceId,
    {
      enabled: !!match.params.serviceId,
    },
  );
  const service = serviceQuery.data;
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (hasTrackedRef.current) return;
    if (params.serviceId && !service) return;
    const prefix = 'PublicCloud::databases_analytics::{category}';
    const { id } = match;
    const routerTrackingKey = (match?.handle as { tracking: string })?.tracking;
    const suffix =
      routerTrackingKey || id || location.pathname.split('/').pop();
    let injectedTrackingKey = `${prefix}::${suffix}`;

    // inject params in key. For exemple replace {category} by params.category if it exists
    injectedTrackingKey = injectedTrackingKey.replace(/{(\w+)}/g, (_, key) => {
      return params[key] || '';
    });

    // Inject service data into the key if available
    if (service) {
      injectedTrackingKey = injectedTrackingKey.replace(
        /{service\.(\w+(\.\w+)*)}/g,
        (_, path) => {
          // Split the path by "." and traverse the `service` object
          const value = path.split('.').reduce((acc: unknown, key: string) => {
            if (typeof acc === 'object' && acc !== null && key in acc) {
              return (acc as Record<string, unknown>)[key];
            }
            return undefined;
          }, service);

          return typeof value === 'string' ? value : ''; // Ensure only strings are returned
        },
      );
    }

    // replace . by ::
    injectedTrackingKey = injectedTrackingKey.replace(/\./g, '::');
    trackPage({
      name: injectedTrackingKey,
      level2: PCI_LEVEL2,
    });
    hasTrackedRef.current = true;
  }, [location.pathname, params.serviceId, service, serviceQuery.isLoading]);

  useEffect(() => {
    hasTrackedRef.current = false;
  }, [location.pathname]);
}
