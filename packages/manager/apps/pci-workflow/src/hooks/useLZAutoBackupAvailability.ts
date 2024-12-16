import { useFeatureAvailability } from '@ovh-ux/manager-react-components';

export const PCI_INSTANCE_LOCAL_ZONE_AUTO_BACKUP =
  'public-cloud:instance:local-zone-auto-backup';

export const useLZAutoBackupAvailability = () => {
  const { data, isLoading } = useFeatureAvailability([
    PCI_INSTANCE_LOCAL_ZONE_AUTO_BACKUP,
  ]);
  return {
    isAvailable:
      !isLoading && Boolean(data?.[PCI_INSTANCE_LOCAL_ZONE_AUTO_BACKUP]),
  };
};
