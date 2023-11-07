import { queryClient } from '@ovh-ux/manager-react-core-application';
import { Task } from '../api.type';
import { createFetchDataFn } from '../common';

export type PostvrackServiceVrackServicesParams = {
  /** The internal name of your vrack */
  serviceName?: string;
  /** vrackServices service name */
  vrackServices?: string;
};

export const postvrackServiceVrackServicesQueryKey = ({
  serviceName,
}: PostvrackServiceVrackServicesParams) => [
  `post/vrack/${serviceName}/vrackServices`,
];

/**
 * List the vrack.vrackServices objects : Add a vrackServices to the vrack
 */
export const postvrackServiceVrackServices = async (
  data: PostvrackServiceVrackServicesParams,
) =>
  queryClient.fetchQuery(
    postvrackServiceVrackServicesQueryKey(data),
    createFetchDataFn<Task>({
      url: `/vrack/${data.serviceName}/vrackServices`,
      method: 'post',
      apiVersion: 'v6',
      params: { data },
    }),
  );
