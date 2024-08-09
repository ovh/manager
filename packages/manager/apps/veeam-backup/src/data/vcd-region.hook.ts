import { apiClient, ApiResponse, ApiError } from '@ovh-ux/manager-core-api';
import { useQuery } from '@tanstack/react-query';
import { VCDRegion } from './veeam-backup/vcd.type';

export type VCDLocation = {
  location: string;
  region: VCDRegion;
};

export const useRegions = () =>
  useQuery<ApiResponse<VCDLocation[]>, ApiError>({
    queryKey: ['/vmwareCloudDirector/reference/region'],
    queryFn: () => apiClient.v2.get('/vmwareCloudDirector/reference/region'),
  });
