import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { FEATURES } from '@/utils/features.constants';

export const useWizardAvailability = () => {
  const { data, ...query } = useFeatureAvailability([
    FEATURES.INSTALLATION_WIZARD,
  ]);

  return {
    isWizardAvailable: data && !!data[FEATURES.INSTALLATION_WIZARD],
    ...query,
  };
};
