import { useContext } from 'react';
import {
  PageType,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { PROJECTS_TRACKING } from '@/tracking.constant';

export const useActivateTracking = () => {
  const { shell } = useContext(ShellContext);
  const { trackPage } = useOvhTracking();

  const trackActivateError = () => {
    trackPage({
      pageType: PageType.bannerError,
      pageName: PROJECTS_TRACKING.ACTIVATE.ERROR_PAGE,
    });
  };

  const trackActivateSuccess = (voucherCode: string) => {
    shell.tracking.trackMixCommanderS3({
      name: PROJECTS_TRACKING.ACTIVATE.SUCCESS_CONVERSION.name,
      tc_additional_params: {
        ...PROJECTS_TRACKING.ACTIVATE.SUCCESS_CONVERSION.tc_additional_params,
        conversion_date: new Date().toISOString(),
        pci_voucher: voucherCode,
      },
    });
  };

  return {
    trackActivateError,
    trackActivateSuccess,
  };
};
