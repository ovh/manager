import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

export const REPRICING_FEATURE = 'pci-public-ip:repricing-instances-pre-com';

export const useRepricing = () => {
  const { data, isLoading } = useFeatureAvailability([REPRICING_FEATURE]);

  return {
    isRepricingEnabled: !!data?.[REPRICING_FEATURE],
    isLoading,
  };
};
