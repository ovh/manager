import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

const kubernetes = 'pci-kubernetes';

const region3AZ = `${kubernetes}:deployment-region-3-az`;

const use3AZPlanAvaible = () => {
  const { data } = useFeatureAvailability([region3AZ]);
  return data?.[region3AZ] || false;
};

export default use3AZPlanAvaible;
