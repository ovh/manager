import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

export const REPRICING_FEATURE = 'public-cloud:repricing-instances';

export const useRepricing = () => {
  const { data, isLoading } = useFeatureAvailability([REPRICING_FEATURE]);

  return {
    isRepricingEnabled: !!data?.[REPRICING_FEATURE],
    isLoading,
  };
};
