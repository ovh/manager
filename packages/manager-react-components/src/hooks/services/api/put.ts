import { useContext } from 'react';
import { ManagerReactComponentContext } from '../../../context/ManagerReactContext';

export type UpdateServiceNameParams = {
  /** Service id */
  serviceId: number;
  /** Service new display name */
  displayName: string;
};

/**
 * Update a service's display name
 */
export const updateServiceName = async ({
  serviceId,
  displayName,
}: UpdateServiceNameParams) => {
  const context = useContext(ManagerReactComponentContext);
  const { apiClient } = context;
  return apiClient.v6.put(`/services/${serviceId}`, {
    displayName,
  });
};
