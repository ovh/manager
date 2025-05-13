import { v6 } from '@ovh-ux/manager-core-api';

export type TOperation = {
  id: string;
  action: string;
  progress: 0;
  resourceId: string;
  status: 'completed' | 'created' | 'in-error' | 'in-progress' | 'unknown';
};

const getOperation = async (projectId: string, operationId: string) => {
  const { data } = await v6.get<TOperation>(
    `/cloud/project/${projectId}/operation/${operationId}`,
  );
  return data;
};

export const checkOperation = async ({
  projectId,
  operationId,
  interval = 2000,
  callback,
}: {
  projectId: string;
  operationId: string;
  interval?: number;
  callback: (operation: TOperation, iteration: number) => boolean;
}) => {
  let iteration = 0;

  const poll = async () => {
    iteration += 1;

    const operation = await getOperation(projectId, operationId);

    const shouldStop = callback(operation, iteration);

    if (!shouldStop) {
      setTimeout(poll, interval);
    }
  };

  await poll();
};
