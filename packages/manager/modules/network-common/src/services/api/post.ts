import { v6 } from '@ovh-ux/manager-core-api';

export type DeleteServiceParams = {
  serviceId: number;
  ovhSubsidiary?: string;
  force?: boolean;
};

const US_SUBSIDIARY = 'US';
/**
 * Delete service
 */
export type DeleteServiceResponse = {
  message: string;
};

export const deleteService = async ({
  serviceId,
  ovhSubsidiary,
  force,
}: DeleteServiceParams) => {
  return ovhSubsidiary === US_SUBSIDIARY || force
    ? v6.delete<DeleteServiceResponse>(`/services/${serviceId}`)
    : v6.post<DeleteServiceResponse>(`/services/${serviceId}/terminate`);
};
