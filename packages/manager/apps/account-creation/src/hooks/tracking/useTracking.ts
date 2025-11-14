import { useCallback } from "react";

import { ButtonType, PageLocation, PageType, usePageTracking } from "@ovh-ux/manager-react-shell-client";
import { useTrackingContext } from "@/context/tracking/useTracking";

export const useTrackBackButtonClick = () => {
  const { trackClick } = useTrackingContext();
  const pageTracking = usePageTracking();

  const trackBackButtonClick = useCallback(() => {
    if (pageTracking) {
      trackClick(pageTracking, {
        location: PageLocation.page,
        buttonType: ButtonType.button,
        actions: ['back-previous-page'],
      });
    }
  }, [trackClick, pageTracking]);

  return {
    trackBackButtonClick,
  };
};

export const useTrackError = (pageName: string) => {
  const { trackPage } = useTrackingContext();

  const trackError = useCallback((error: string) => {
    trackPage({ pageName: `${pageName}_error_${error}`, pageType: PageType.bannerError, pageCategory: 'banner' });
  }, [trackPage, pageName]);

  return {
    trackError,
  };
};