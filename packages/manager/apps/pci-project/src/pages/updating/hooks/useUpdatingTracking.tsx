import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { PROJECTS_TRACKING } from '@/tracking.constant';

type TrackProjectUpdatedSuccessParams = {
  voucherCode?: string;
};

export const useUpdatingTracking = () => {
  const { trackPage } = useOvhTracking();

  const trackProjectUpdated = () => {
    trackPage({
      pageName: PROJECTS_TRACKING.UPDATING.PROJECT_UPDATED,
    });
  };

  const trackActivateProjectSuccess = ({
    voucherCode,
  }: TrackProjectUpdatedSuccessParams) => {
    trackPage({
      pageName: PROJECTS_TRACKING.UPDATING.ACTIVATE_PROJECT_SUCCESS,
      ...(voucherCode ? { voucherCode } : {}),
    });
  };

  const trackActivateProjectError = () => {
    trackPage({
      pageName: PROJECTS_TRACKING.UPDATING.ACTIVATE_PROJECT_ERROR,
    });
  };

  return {
    trackProjectUpdated,
    trackActivateProjectSuccess,
    trackActivateProjectError,
  };
};
