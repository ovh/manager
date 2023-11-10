import { queryClient } from '@ovh-ux/manager-react-core-application';
import { VrackServices } from './vrack-services.type';
import { createFetchDataFn } from '../common';

export type PutVrackServicesResourceVrackServicesIdParams = {
  /** Request Body */
  vrackservicesCustom?: VrackServices;
  /** Vrack services ID */
  vrackServicesId?: string;
};

export const putVrackServicesResourceVrackServicesIdQueryKey = ({
  vrackServicesId,
}: PutVrackServicesResourceVrackServicesIdParams) => [
  `put/vrackServices/resource/${vrackServicesId}`,
];

/**
 * Operations on vRack Services : Update the vRack Services configuration
 */
export const putVrackServicesResourceVrackServicesId = async (
  data: PutVrackServicesResourceVrackServicesIdParams,
) =>
  queryClient.fetchQuery(
    putVrackServicesResourceVrackServicesIdQueryKey(data),
    createFetchDataFn<VrackServices>({
      url: `/vrackServices/resource/${data.vrackServicesId}`,
      method: 'put',
      apiVersion: 'v2',
      params: { data },
    }),
  );
