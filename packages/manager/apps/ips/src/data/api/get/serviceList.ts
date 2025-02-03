import { apiClient, ApiResponse } from '@ovh-ux/manager-core-api';
import { ServiceType } from '@/types';

export type ServiceListResponse = {
  results: [
    {
      name: string;
      services: { serviceName: string; displayName: string }[];
    },
  ];
  errors: { msg: string }[];
};

export const getServiceList = (
  serviceType: Omit<ServiceType, 'unknown' | 'ipParking' | 'vrack'>,
): Promise<ApiResponse<ServiceListResponse>> =>
  apiClient.aapi.get(`products?product=${serviceType}`);
