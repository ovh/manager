import { v6 } from '@ovh-ux/manager-core-api';

export type DeleteServiceParams = {
  serviceId: number;
};

const US_SUBSIDIARY = 'US';
/**
 * Delete service
 */
export type DeleteServiceResponse = {
  message: string;
};

export const deleteService = async (
  { serviceId }: DeleteServiceParams,
  ovhSubsidiary?: string,
) => {
  return ovhSubsidiary === US_SUBSIDIARY
    ? v6.delete<DeleteServiceResponse>(`/services/${serviceId}`)
    : v6.post<DeleteServiceResponse>(`/services/${serviceId}/terminate`);
};
