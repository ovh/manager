import { apiClient } from '@ovh-ux/manager-core-api';
import { VrackTask } from '../api.type';

export type DissociateVrackServicesParams = {
  /** The internal name of your vrack */
  vrack: string;
  /** vrackServices service name */
  vrackServices: string;
};

export const dissociateVrackServicesQueryKey = (vrackServicesId: string) => [
  `dissociateVrackServices-${vrackServicesId}`,
];

/**
 * Dissociate vRack Services from a vRack
 */
export const dissociateVrackServices = async ({
  vrack,
  vrackServices,
}: DissociateVrackServicesParams) =>
  apiClient.v6.delete<VrackTask>(
    `/vrack/${vrack}/vrackServices/${vrackServices}`,
  );
