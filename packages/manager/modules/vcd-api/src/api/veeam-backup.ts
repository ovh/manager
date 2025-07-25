import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { VeeamBackup, VeeamBackupOfferTargetSpec } from '../types';

export const getVmwareCloudDirectorBackup = async (
  backupId: string,
): Promise<ApiResponse<VeeamBackup>> =>
  apiClient.v2.get(`/vmwareCloudDirector/backup/${backupId}`);

export const activateVmwareCloudDirectorBackupOffer = async ({
  backupId,
  offer: { name, quotaInTB = 0 },
}: {
  backupId: string;
  offer: VeeamBackupOfferTargetSpec;
}): Promise<ApiResponse<VeeamBackup>> =>
  apiClient.v2.put(`/vmwareCloudDirector/backup/${backupId}`, {
    targetSpec: {
      offers: [{ name, quotaInTB }],
    },
  });

export const activateVmwareCloudDirectorBackupOfferGold = async (
  backupId: string,
  quotaInTB = 100,
): Promise<ApiResponse<VeeamBackup>> =>
  activateVmwareCloudDirectorBackupOffer({
    backupId,
    offer: {
      name: 'GOLD',
      quotaInTB,
    },
  });
