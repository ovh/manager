import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

const kubernetes = 'pci-kubernetes';

const repricingInstances = `${kubernetes}:repricing-instances`;

const useRepricingInstancesAvailable = () => {
  const { data } = useFeatureAvailability([repricingInstances]);
  return Boolean(data?.[repricingInstances]);
};

export default useRepricingInstancesAvailable;
