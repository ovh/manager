import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

const svpApp = 'pci-savings-plan';

const deployment3AZ = `${svpApp}:deployment-region-3-az`;
const rancherService = `${svpApp}:rancher-service`;
export const INSTANCES_REPRICING = 'repricing-instances-pre-com';

export const useSavingsPlanCreationOptionsFeatureAvailability = () => {
  const { data } = useFeatureAvailability([
    deployment3AZ,
    rancherService,
    INSTANCES_REPRICING,
  ]);

  return {
    isDeployment3AZAvailable: data?.[deployment3AZ],
    isRancherServiceAvailable: data?.[rancherService],
    isInstancesRepricingAvailable: data?.[INSTANCES_REPRICING],
  };
};
