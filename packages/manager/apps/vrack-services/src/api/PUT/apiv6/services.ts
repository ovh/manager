import apiClient from '@ovh-ux/manager-core-api';
import { queryClient } from '@ovh-ux/manager-react-core-application';
import { Vrack, ResponseData } from '../../api.type';

export type PutVrackServiceParams = {
  /** New object properties */
  vrackCustom?: Vrack;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const putVrackServiceQueryKey = (params: PutVrackServiceParams) => [
  `put/vrack/${params.serviceName}`,
];

/**
 * vrack : Alter this object properties
 */
export const putVrackService = async (
  params: PutVrackServiceParams,
): Promise<{ status: number }> => {
  const fetchData = async () => {
    const response: ResponseData<undefined> = await apiClient.v6.put(
      `/vrack/${params.serviceName}`,
      { data: params },
    );
    if (response?.code?.startsWith('ERR')) {
      // Error in the request
      const errorResponse = response.response;
      return errorResponse;
    }
    return { status: response?.status };
  };

  return queryClient.fetchQuery(putVrackServiceQueryKey(params), fetchData);
};
