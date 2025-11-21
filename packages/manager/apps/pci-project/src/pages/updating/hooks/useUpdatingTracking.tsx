import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { PROJECTS_TRACKING } from '@/tracking.constant';

type TrackProjectUpdatedSuccessParams = {
  voucherCode?: string;
};

export const useUpdatingTracking = () => {
  const { trackPage } = useOvhTracking();

  const trackProjectUpdated = () => {
    trackPage({
      pageType: PageType.bannerInfo,
      pageName: PROJECTS_TRACKING.UPDATING.PROJECT_UPDATED,
    });
  };

  const trackUpdateProjectSuccess = ({
    voucherCode,
  }: TrackProjectUpdatedSuccessParams) => {
    trackPage({
      pageType: PageType.bannerInfo,
      pageName: PROJECTS_TRACKING.UPDATING.UPDATE_PROJECT_SUCCESS,
      ...(voucherCode ? { voucherCode } : {}),
    });
  };

  const trackUpdateProjectError = () => {
    trackPage({
      pageType: PageType.bannerError,
      pageName: PROJECTS_TRACKING.UPDATING.UPDATE_PROJECT_ERROR,
    });
  };

  return {
    trackProjectUpdated,
    trackUpdateProjectSuccess,
    trackUpdateProjectError,
  };
};
