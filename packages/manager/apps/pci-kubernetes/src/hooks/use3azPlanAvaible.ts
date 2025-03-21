import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

const kubernetes = 'pci-kubernetes';

const region3AZ = `${kubernetes}:deployment-region-3-az`;

const use3AZPlanAvailable = () => {
  const { data } = useFeatureAvailability([region3AZ]);
  return Boolean(true || data?.[region3AZ]);
};

export default use3AZPlanAvailable;
