import { v6 } from '@ovh-ux/manager-core-api';
import { US_SUBSIDIARY } from '@/constants';

/**
 * Delete service
 */
export type DeleteServiceResponse = {
  message: string;
};
export const deleteService = async (
  serviceId: number,
  ovhSubsidiary: string,
) => {
  return ovhSubsidiary === US_SUBSIDIARY
    ? v6.delete<DeleteServiceResponse>(`/services/${serviceId}`)
    : v6.post<DeleteServiceResponse>(`/services/${serviceId}/terminate`);
};
