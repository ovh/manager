import { useContext } from 'react';
import { ManagerReactComponentContext } from '../../../context/ManagerReactComponentsContext';
import { ServiceDetails } from '../services.type';

export type GetResourceServiceIdParams = {
  /** Filter on a specific service family */
  resourceName: string;
};

export const getResourceServiceIdQueryKey = ({
  resourceName = '',
}: GetResourceServiceIdParams) => [`get/services${resourceName}`];

/**
 * allowedServices operations : List all services allowed in this vrack
 */
export const getResourceServiceId = async ({
  resourceName,
}: GetResourceServiceIdParams) => {
  const context = useContext(ManagerReactComponentContext);
  const { apiClient } = context;
  return apiClient.v6.get<number[]>(
    `/services${resourceName ? `?resourceName=${resourceName}` : ''}`,
  );
};

export const getServiceDetails = async (serviceId: number | string) => {
  const context = useContext(ManagerReactComponentContext);
  const { apiClient } = context;
  return apiClient.v6.get<ServiceDetails>(`/services/${serviceId}`);
};
