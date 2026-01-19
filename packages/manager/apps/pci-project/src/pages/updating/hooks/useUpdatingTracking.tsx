import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { useTrackingAdditionalData } from '@/hooks/useTracking';
import { PROJECTS_TRACKING } from '@/tracking.constant';

type TrackProjectUpdatedSuccessParams = {
  voucherCode?: string;
};

export const useUpdatingTracking = () => {
  const { trackPage } = useOvhTracking();
  const trackingAdditionalData = useTrackingAdditionalData();

  const trackProjectUpdated = () => {
    trackPage({
      pageType: PageType.bannerInfo,
      pageName: PROJECTS_TRACKING.UPDATING.PROJECT_UPDATED,
      additionalData: trackingAdditionalData,
    });
  };

  const trackUpdateProjectSuccess = ({ voucherCode }: TrackProjectUpdatedSuccessParams) => {
    trackPage({
      pageType: PageType.bannerInfo,
      pageName: PROJECTS_TRACKING.UPDATING.UPDATE_PROJECT_SUCCESS,
      additionalData: {
        ...trackingAdditionalData,
        voucherCode: voucherCode || '',
      },
    });
  };

  const trackUpdateProjectError = (errorMessage: string) => {
    trackPage({
      pageType: PageType.bannerError,
      pageName: PROJECTS_TRACKING.UPDATING.UPDATE_PROJECT_ERROR,
      additionalData: {
        ...trackingAdditionalData,
        pciCreationErrorMessage: errorMessage,
      },
    });
  };

  return {
    trackProjectUpdated,
    trackUpdateProjectSuccess,
    trackUpdateProjectError,
  };
};
