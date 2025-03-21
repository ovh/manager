import { useProject } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useEffect } from 'react';
import { useLocation, useMatches } from 'react-router-dom';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';

const DISCOVERY_PLAN_CODE = 'project.discovery';
const PCI_LEVEL2 = '86';

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
      type: 'action',
      level2: PCI_LEVEL2,
    });
  };

  const trackCopyClipboardClick = (action: string) => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${page}_success_copy-${action}`,
      type: 'action',
      level2: PCI_LEVEL2,
    });
  };

  const trackNavigationClick = (action: string) => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${page}::${action}`,
      type: 'navigation',
      level2: PCI_LEVEL2,
    });
  };

  const trackSuccessPage = () => {
    tracking?.trackPage({
      name: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${page}_success`,
      type: 'navigation',
      level2: PCI_LEVEL2,
    });
  };

  const trackErrorPage = () => {
    tracking?.trackPage({
      name: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${page}_error`,
      type: 'navigation',
      level2: PCI_LEVEL2,
    });
  };

  const trackCancelAction = () => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${page}::cancel`,
      type: 'action',
      level2: PCI_LEVEL2,
    });
  };

  const trackConfirmAction = () => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.PAGE_PREFIX}::${page}::confirm`,
      type: 'action',
      level2: PCI_LEVEL2,
    });
  };

  return {
    trackActionClick,
    trackNavigationClick,
    trackSuccessPage,
    trackErrorPage,
    trackCancelAction,
    trackConfirmAction,
    trackCopyClipboardClick,
  };
};
