import { queryClient } from '@ovh-ux/manager-react-core-application';
import { Task } from '../../api.type';
import { createFetchDataFn } from '../../common';

export type DeletevrackServiceVrackServicesVrackServicesParams = {
  /** The internal name of your vrack */
  serviceName?: string;
  /** vrackServices service name */
  vrackServices?: string;
};

export const deletevrackServiceVrackServicesVrackServicesQueryKey = ({
  serviceName,
  vrackServices,
}: DeletevrackServiceVrackServicesVrackServicesParams) => [
  `delete/vrack/${serviceName}/vrackServices/${vrackServices}`,
];

/**
 * vrackServices in vrack : Remove the vrackServices from the vrack
 */
export const deletevrackServiceVrackServicesVrackServices = async ({
  serviceName,
  vrackServices,
}: DeletevrackServiceVrackServicesVrackServicesParams) =>
  queryClient.fetchQuery(
    deletevrackServiceVrackServicesVrackServicesQueryKey({
      serviceName,
      vrackServices,
    }),
    createFetchDataFn<Task>({
      url: `/vrack/${serviceName}/vrackServices/${vrackServices}`,
      method: 'delete',
      apiVersion: 'v6',
    }),
  );
