import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { VeeamBackupWithIam } from '../types';

export const getVmwareCloudDirectorBackup = async (
  backupId: string,
): Promise<ApiResponse<VeeamBackupWithIam>> =>
  apiClient.v2.get(`/vmwareCloudDirector/backup/${backupId}`);
