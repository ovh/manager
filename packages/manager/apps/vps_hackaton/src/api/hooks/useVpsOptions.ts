import { useSnapshot } from './useSnapshot';
import { useVeeamBackup } from './useVeeam';
import { useBackupStorage } from './useBackupStorage';
import type { TVpsOptions, TVpsOptionStatus } from '@/domain/entities/options';

const getOptionStatus = (
  data: unknown,
  isLoading: boolean,
  isError: boolean,
): TVpsOptionStatus => {
  if (isLoading) return 'pending';
  if (isError) return 'error';
  if (data) return 'enabled';
  return 'disabled';
};

export const useVpsOptions = (serviceName: string) => {
  const snapshot = useSnapshot(serviceName, {});
  const veeam = useVeeamBackup(serviceName, {});
  const backupStorage = useBackupStorage(serviceName, {});

  const options: TVpsOptions = {
    snapshot: getOptionStatus(
      snapshot.data,
      snapshot.isLoading,
      snapshot.isError,
    ),
    veeam: getOptionStatus(veeam.data, veeam.isLoading, veeam.isError),
    backupStorage: getOptionStatus(
      backupStorage.data,
      backupStorage.isLoading,
      backupStorage.isError,
    ),
    additionalDisk: 'disabled', // Would need separate API call
  };

  return {
    data: options,
    isLoading: snapshot.isLoading || veeam.isLoading || backupStorage.isLoading,
    isError: snapshot.isError || veeam.isError || backupStorage.isError,
  };
};
