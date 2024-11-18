import { ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { order } from '../catalog.type';
import { VCDCatalog } from '../types';

export const getVeeamBackupCatalog = async (
  ovhSubsidiray: string,
): Promise<ApiResponse<order.publicOrder.Catalog>> =>
  apiClient.v6.get(
    `/order/catalog/public/vmwareCloudDirectorBackup?ovhSubsidiary=${ovhSubsidiray}`,
  );

export const getVcdCatalog = async (
  serviceName: string,
): Promise<ApiResponse<VCDCatalog>> =>
  apiClient.v6.get(
    `/order/cartServiceOption/vmwareCloudDirector/${serviceName}`,
  );
