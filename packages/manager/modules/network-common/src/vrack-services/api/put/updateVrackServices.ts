import { apiClient } from '@ovh-ux/manager-core-api';
import { TargetSpec, VrackServices } from '../../../types';

export const updateVrackServicesQueryKey = (vrackServicesId: string) => [
  'put/vrackServices/resource',
  vrackServicesId,
];

export type UpdateVrackServicesParams = {
  checksum: string;
  targetSpec: TargetSpec;
  vrackServicesId: string;
};

/**
 * Operations on vRack Services : Update the vRack Services configuration
 */
export const updateVrackServices = async ({
  vrackServicesId,
  checksum,
  targetSpec,
}: UpdateVrackServicesParams) =>
  apiClient.v2.put<VrackServices>(
    `/vrackServices/resource/${vrackServicesId}`,
    {
      checksum,
      targetSpec: {
        subnets:
          targetSpec.subnets?.map((subnet) => ({
            cidr: subnet.cidr,
            displayName: subnet.displayName || null,
            serviceRange: {
              cidr: subnet.serviceRange.cidr,
              // Need to remove ip configurations
            },
            serviceEndpoints:
              subnet.serviceEndpoints?.map((endpoint) => ({
                // Need to remove endpoints configurations
                managedServiceURN: endpoint.managedServiceURN,
              })) || [],
            vlan: subnet.vlan || null,
          })) || [],
      },
    },
  );
