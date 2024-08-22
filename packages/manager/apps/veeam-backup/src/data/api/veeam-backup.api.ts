import { apiClient } from '@ovh-ux/manager-core-api';
import { VeeamBackupWithIam } from '../vcd.type';

export const getVmwareCloudDirectorBackup = async (
  backupId: string,
): Promise<VeeamBackupWithIam> =>
  apiClient.v2.get(`/vmwareCloudDirector/backup/${backupId}`);
