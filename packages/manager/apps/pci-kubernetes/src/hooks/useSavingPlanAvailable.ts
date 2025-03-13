import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

const kubernetes = 'pci-kubernetes';

const savingPlan = `${kubernetes}:savings-plan`;

const useSavingPlanAvailable = () => {
  const { data } = useFeatureAvailability([savingPlan]);
  return data?.[savingPlan];
};

export default useSavingPlanAvailable;
