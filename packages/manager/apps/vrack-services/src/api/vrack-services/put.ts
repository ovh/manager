import { queryClient } from '@ovh-ux/manager-react-core-application';
import {
  UpdateVrackServicesParams,
  VrackServices,
} from './vrack-services.type';
import { createFetchDataFn } from '../common';

export const updateVrackServicesQueryKey = ({
  vrackServicesId,
}: UpdateVrackServicesParams) => [
  `put/vrackServices/resource/${vrackServicesId}`,
];

/**
 * Operations on vRack Services : Update the vRack Services configuration
 */
export const updateVrackServices = async ({
  vrackServicesId,
  checksum,
  targetSpec,
}: UpdateVrackServicesParams) =>
  queryClient.fetchQuery(
    updateVrackServicesQueryKey({ checksum, targetSpec, vrackServicesId }),
    createFetchDataFn<VrackServices>({
      url: `/vrackServices/resource/${vrackServicesId}`,
      method: 'put',
      apiVersion: 'v2',
      params: { checksum, targetSpec },
    }),
  );
