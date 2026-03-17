import {
  PCI_FEATURES_FREE_LOCAL_ZONES_BANNER,
  PCI_FEATURES_BILLING_OLD_BILLING_BANNER,
} from '@/constants';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

export const useBillingBannerFeatures = () => {
  const { data } = useFeatureAvailability([
    PCI_FEATURES_FREE_LOCAL_ZONES_BANNER,
    PCI_FEATURES_BILLING_OLD_BILLING_BANNER,
  ]);

  const hasFreeLocalZonesBanner = data?.[PCI_FEATURES_FREE_LOCAL_ZONES_BANNER];
  const hasOldBillingBanner = data?.[PCI_FEATURES_BILLING_OLD_BILLING_BANNER];

  return {
    hasFreeLocalZonesBanner,
    hasOldBillingBanner,
  };
};
