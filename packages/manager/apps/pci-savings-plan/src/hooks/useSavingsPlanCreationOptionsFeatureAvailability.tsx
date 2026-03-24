import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

const svpApp = 'pci-savings-plan';

const deployment3AZ = `${svpApp}:deployment-region-3-az`;
const rancherService = `${svpApp}:rancher-service`;

export const useSavingsPlanCreationOptionsFeatureAvailability = () => {
  const { data } = useFeatureAvailability([deployment3AZ, rancherService]);

  return {
    isDeployment3AZAvailable: data?.[deployment3AZ],
    isRancherServiceAvailable: data?.[rancherService],
  };
};
