import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

export const RANCHER_IAM_FEATURE = 'pci-rancher:iam';

export const useIamActivated = () => {
  const { data, isLoading } = useFeatureAvailability([RANCHER_IAM_FEATURE]);
  return {
    isIAmActivated: data && !!data[RANCHER_IAM_FEATURE],
    isLoading,
  };
};
