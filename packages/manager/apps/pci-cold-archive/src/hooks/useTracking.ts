import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import { useProject } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect } from 'react';
import { useLocation, useMatches } from 'react-router-dom';

const DISCOVERY_PLAN_CODE = 'project.discovery';

export const usePageTracking = () => {
  const location = useLocation();
  const matches = useMatches();

  const { data: project } = useProject();

  const { setPciProjectMode, trackPage } = useContext(
    ShellContext,
  ).shell.tracking;

  useEffect(() => {
    if (project) {
      setPciProjectMode({
        projectId: project.project_id,
        isDiscoveryProject: project.planCode === DISCOVERY_PLAN_CODE,
      });
    }
  }, [project]);

  useEffect(() => {
    const matchedRoute = matches[matches.length - 1];

    trackPage({
      name: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${matchedRoute?.id}`,
      level2: COLD_ARCHIVE_TRACKING.PCI_LEVEL2,
    });
  }, [location]);
};

export const useTracking = (page: string) => {
  const { tracking } = useContext(ShellContext).shell;

  const trackActionClick = (action: string) => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${page}::${action}`,
      type: 'click',
    });
  };

  const trackNavigationClick = (action: string) => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${page}::${action}`,
      type: 'navigation',
    });
  };

  const trackSuccessPage = () => {
    tracking?.trackPage({
      name: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${page}_success`,
      type: 'navigation',
    });
  };

  const trackErrorPage = () => {
    tracking?.trackPage({
      name: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${page}_error`,
      type: 'navigation',
    });
  };

  const trackCancelAction = () => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${page}::cancel`,
      type: 'click',
    });
  };

  const trackConfirmAction = () => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${page}::confirm`,
      type: 'click',
    });
  };

  return {
    trackActionClick,
    trackNavigationClick,
    trackSuccessPage,
    trackErrorPage,
    trackCancelAction,
    trackConfirmAction,
  };
};
