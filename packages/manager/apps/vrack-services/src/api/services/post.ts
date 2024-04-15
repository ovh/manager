import { ApiError, ApiResponse, apiClient } from '@ovh-ux/manager-core-api';
import { Task } from '../api.type';
import { GetVrackServicesServiceId, GetVrackServicesServiceIdQueryKey } from './get';
import { useQueries, useQuery } from '@tanstack/react-query';

export type DeleteVrackServicesParams = {
  /** vrackServices service name */
  serviceId: number;
};

export const DeleteVrackServicesQueryKey = (vrackServices: string) => [
  `deleteVrackServices-${vrackServices}`,
];

/**
 * Add a vrackServices to the vrack
 */
export const DeleteVrackServices = async ({
  serviceId,
}: DeleteVrackServicesParams) =>
  apiClient.v6.post<{message: string}>(`/services/${serviceId}/terminate`);
