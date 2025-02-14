import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { COLD_ARCHIVE_TRACKING } from '@/constants';

export const useTracking = (page: string) => {
  const { tracking } = useContext(ShellContext).shell;

  const trackActionClick = (action: string) => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}::${page}::${action}`,
      type: 'click',
    });
  };

  const trackNavigationClick = (action: string) => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}::${page}::${action}`,
      type: 'navigation',
    });
  };

  const trackSuccessPage = () => {
    tracking?.trackPage({
      name: `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}::${page}_success`,
      type: 'navigation',
    });
  };

  const trackErrorPage = () => {
    tracking?.trackPage({
      name: `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}::${page}_error`,
      type: 'navigation',
    });
  };

  const trackCancelAction = () => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}::${page}::cancel`,
      type: 'click',
    });
  };

  const trackConfirmAction = () => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.CLICK_PREFIX}::${page}::confirm`,
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

export default useTracking;
