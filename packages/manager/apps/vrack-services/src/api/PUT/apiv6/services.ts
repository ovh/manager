import { queryClient } from '@ovh-ux/manager-react-core-application';
import { Vrack } from '../../api.type';
import { createFetchDataFn } from '../../common';

export type PutVrackServiceParams = {
  /** New object properties */
  vrackCustom?: Vrack;
  /** The internal name of your vrack */
  serviceName?: string;
};

export const putVrackServiceQueryKey = ({
  serviceName,
}: PutVrackServiceParams) => [`put/vrack/${serviceName}`];

/**
 * vrack : Alter this object properties
 */
export const putVrackService = async (data: PutVrackServiceParams) =>
  queryClient.fetchQuery(
    putVrackServiceQueryKey(data),
    createFetchDataFn<undefined>({
      url: `/vrack/${data.serviceName}`,
      method: 'put',
      params: { data },
      apiVersion: 'v6',
    }),
  );
