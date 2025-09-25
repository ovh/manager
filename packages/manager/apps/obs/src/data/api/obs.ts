import apiClient from '@ovh-ux/manager-core-api';
import { ObservabilityResource } from '../types/response';
import { UpdateObservabilityServiceNamePayload } from '../types/UpdateObservabilityServiceNamePayload.type';

export const getObservabilityServicesListQueryKey = [
  '/observability/services/list',
];

export const getObservabilityServicesList = async (): Promise<ObservabilityResource[]> => {
  const response = await apiClient.v2.get('/observability');
  return response.data;
};

export const getObservabilityServiceQueryKey = (serviceId: string) =>
  ['observability', 'serviceName', serviceId] as const;

export const getObservabilityService = async (
  serviceName: string,
): Promise<ObservabilityResource> => {
  const response = await apiClient.v2.get(`/observability/${serviceName}`);
  return response.data;
};

export const updateObservabilityService = async (
  serviceId: string,
  payload: UpdateObservabilityServiceNamePayload,
): Promise<ObservabilityResource> => {
  const response = await apiClient.v2.put(
    `/observability/${serviceId}`,
    payload,
  );
  return response.data;
};
