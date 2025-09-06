import { getLogOperation } from '../data/api/logOperation';
import { Operation, OperationStateEnum, Service } from '../data/types/dbaas/logs';

export const pollLogOperation = async (
  serviceName: Service['serviceName'],
  operationId: Operation['operationId'],
  intervalMs = 1000,
) => {
  const poll = async (): Promise<unknown> => {
    const operation = await getLogOperation(serviceName, operationId);

    if (operation.state === OperationStateEnum.SUCCESS) {
      return operation;
    }
    if (operation.state === OperationStateEnum.FAILURE) {
      throw new Error(operation.state);
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs));
    return poll();
  };
  return poll();
};
