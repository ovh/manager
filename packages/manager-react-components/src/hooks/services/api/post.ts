import React, { useContext } from 'react';
import { ManagerReactComponentContext } from '../../../context/ManagerReactContext';

export type DeleteServiceParams = {
  serviceId: number;
};

/**
 * Terminate a service
 */
export const deleteService = async ({ serviceId }: DeleteServiceParams) => {
  const context = useContext(ManagerReactComponentContext);
  const { apiClient } = context;
  return apiClient.v6.post<{ message: string }>(
    `/services/${serviceId}/terminate`,
  );
};
