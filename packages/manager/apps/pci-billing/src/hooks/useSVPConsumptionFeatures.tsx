import { PCI_FEATURES_SVP_CONSUMPTION } from '@/constants';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

export const useSVPConsumptionFeatures = () => {
  const { data } = useFeatureAvailability([PCI_FEATURES_SVP_CONSUMPTION]);

  const hasSVPConsumption = data?.[PCI_FEATURES_SVP_CONSUMPTION];

  return {
    hasSVPConsumption,
  };
};
