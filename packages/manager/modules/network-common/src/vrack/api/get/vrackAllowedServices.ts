import { apiClient } from '@ovh-ux/manager-core-api';
import { AllowedService, AllowedServicesResponse } from '../../../types';

export type GetVrackAllowedServicesParams = {
  /** Filter on a specific service family */
  serviceFamily: AllowedService;
  /** The internal name of your vrack */
  vrack: string;
};

export const getVrackAllowedServicesQueryKey = ({
  vrack,
  serviceFamily,
}: GetVrackAllowedServicesParams) => [
  `get/vrack/${vrack}/allowedServices${serviceFamily || ''}`,
];

/**
 * allowedServices operations : List all services allowed in this vrack
 */
export const getVrackAllowedServices = async ({
  vrack,
  serviceFamily,
}: GetVrackAllowedServicesParams) =>
  apiClient.v6.get<AllowedServicesResponse>(
    `/vrack/${vrack}/allowedServices${
      serviceFamily ? `?serviceFamily=${serviceFamily}` : ''
    }`,
  );
