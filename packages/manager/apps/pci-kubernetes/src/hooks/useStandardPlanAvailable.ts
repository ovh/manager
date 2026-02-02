import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

const kubernetes = 'pci-kubernetes';

const regionStandardPlan = `${kubernetes}:deployment-standard-plan`;

const useStandardPlanAvailable = () => {
  const { data } = useFeatureAvailability([regionStandardPlan]);
  return Boolean(data?.[regionStandardPlan]);
};

export default useStandardPlanAvailable;
