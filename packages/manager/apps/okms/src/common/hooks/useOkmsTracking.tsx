import { useContext } from 'react';

import {
  ShellContext,
  TrackingClickParams,
  TrackingPageParams,
  getClickProps,
  getPageProps,
  usePageTracking,
} from '@ovh-ux/manager-react-shell-client';

import { useProductType } from './useProductType';

/**
 * Custom tracking hook to manage OKMS product types
 * based on @ovh-ux/manager-react-shell-client useOvhTracking hook
 * chapter3 and appName will automatically inherit the productType
 * e.g. 'key-management-service' or 'secret-manager'
 */

export const useOkmsTracking = () => {
  const { shell, environment, tracking } = useContext(ShellContext);
  const pageTracking = usePageTracking();
  const productType = useProductType();

  const region = environment?.getRegion();
  const level2 = (region && tracking?.level2Config?.[region]?.config?.level2) || tracking?.level2;

  const trackCurrentPage = () => {
    shell.tracking.trackPage(
      getPageProps({
        ...tracking,
        ...pageTracking,
        chapter3: productType,
        appName: productType,
        level2,
      }),
    );
  };

  const trackPage = ({ pageName, pageType }: TrackingPageParams) => {
    shell.tracking.trackPage(
      getPageProps({
        ...tracking,
        ...pageTracking,
        chapter3: productType,
        appName: productType,
        pageName,
        pageType,
        level2,
      }),
    );
  };

  const trackClick = ({ location, buttonType, actions, actionType }: TrackingClickParams) => {
    shell.tracking.trackClick(
      getClickProps({
        ...tracking,
        ...pageTracking,
        chapter3: productType,
        appName: productType,
        location,
        buttonType,
        actions,
        actionType,
        level2,
      }),
    );
  };

  return {
    trackCurrentPage,
    trackPage,
    trackClick,
  };
};
