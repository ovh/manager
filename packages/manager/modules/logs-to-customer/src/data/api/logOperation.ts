import { v6 } from '@ovh-ux/manager-core-api';
import { Operation, Service } from '../types/dbaas/logs';

/**
 * GET Log operation
 */
export const getLogOperation = async (
  serviceName: Service['serviceName'],
  operationId: Operation['operationId'],
) => {
  const { data: operation } = await v6.get<Operation>(
    `/dbaas/logs/${serviceName}/operation/${operationId}`,
  );
  return operation;
};
