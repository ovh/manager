import apiClient from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { VrackServices, ResponseData } from '../../api.type';

export type PutVrackServicesResourceVrackServicesIdParams = {
  /** Request Body */
  vrackservicesCustom?: VrackServices;
  /** Vrack services ID */
  vrackServicesId?: string;
};

export const putVrackServicesResourceVrackServicesIdQueryKey = (
  params: PutVrackServicesResourceVrackServicesIdParams,
) => [`put/vrackServices/resource/${params.vrackServicesId}`];

/**
 * Operations on vRack Services : Update the vRack Services configuration
 */
export const putVrackServicesResourceVrackServicesId = async (
  params: PutVrackServicesResourceVrackServicesIdParams,
): Promise<VrackServices> => {
  const fetchData = async () => {
    const response: ResponseData<VrackServices> = await apiClient.v2.put(
      `/vrackServices/resource/${params.vrackServicesId}`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { ...response.data, status: response?.status };
  };

  return queryClient.fetchQuery(
    putVrackServicesResourceVrackServicesIdQueryKey(params),
    fetchData,
  );
};
