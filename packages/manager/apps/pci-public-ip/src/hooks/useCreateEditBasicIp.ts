import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

export const CREATE_EDIT_BASIC_IP_FEATURE =
  'pci-public-ip:create-edit-basic-ip';

export const useCreateEditBasicIp = () => {
  const { data, isLoading } = useFeatureAvailability([
    CREATE_EDIT_BASIC_IP_FEATURE,
  ]);

  return {
    isCreateEditBasicIpEnabled: !!data?.[CREATE_EDIT_BASIC_IP_FEATURE],
    isLoading,
  };
};
