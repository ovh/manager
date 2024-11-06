import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { order } from '../catalog.type';

export const getVeeamBackupCatalog = async (
  ovhSubsidiray: string,
): Promise<ApiResponse<order.publicOrder.Catalog>> =>
  apiClient.v6.get(
    `/order/catalog/public/vmwareCloudDirectorBackup?ovhSubsidiary=${ovhSubsidiray}`,
  );
