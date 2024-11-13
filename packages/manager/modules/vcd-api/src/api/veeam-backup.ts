import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { VeeamBackup } from '../types';

export const getVmwareCloudDirectorBackup = async (
  backupId: string,
): Promise<ApiResponse<VeeamBackup>> =>
  apiClient.v2.get(`/vmwareCloudDirector/backup/${backupId}`);
