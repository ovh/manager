import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { PCI_FEATURES_REPRICING_INSTANCES } from '@/constants';

export const useRepricingInstances = () => {
  const { data } = useFeatureAvailability([PCI_FEATURES_REPRICING_INSTANCES]);

  const hasRepricingInstances = data?.[PCI_FEATURES_REPRICING_INSTANCES];

  return {
    hasRepricingInstances,
  };
};
