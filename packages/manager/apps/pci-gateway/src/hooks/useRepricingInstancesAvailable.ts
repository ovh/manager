import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

const gateway = 'pci-gateway';

export const REPRICING_INSTANCES = `${gateway}:repricing-instances`;

const useRepricingInstancesAvailable = () => {
  const { data } = useFeatureAvailability([REPRICING_INSTANCES]);
  return Boolean(data?.[REPRICING_INSTANCES]);
};

export default useRepricingInstancesAvailable;
