import { Task } from '../api.type';
import { createFetchDataFn } from '../common';

export type AssociateVrackServicesParams = {
  /** The internal name of your vrack */
  vrack: string;
  /** vrackServices service name */
  vrackServices: string;
};

export const associateVrackServicesQueryKey = (vrackServicesId: string) => [
  `associateVrackServices-${vrackServicesId}`,
];

/**
 * Add a vrackServices to the vrack
 */
export const associateVrackServices = async ({
  vrack,
  vrackServices,
}: AssociateVrackServicesParams) =>
  createFetchDataFn<Task>({
    url: `/vrack/${vrack}/vrackServices`,
    method: 'post',
    apiVersion: 'v6',
    params: { vrackServices },
  })();
