import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

const repricingInstances = 'pci-instances:repricing-instances';

export const useRepricingInstancesAvailable = (): boolean => {
  const { data } = useFeatureAvailability([repricingInstances]);

  return Boolean(data?.[repricingInstances]);
};
