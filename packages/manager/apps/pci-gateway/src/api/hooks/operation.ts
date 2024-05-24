import { v6 } from '@ovh-ux/manager-core-api';
import { useEffect, useState } from 'react';
import { TOperation } from '@/api/data/operation';

type TState = {
  opId: string;
  operation: TOperation;
  isPending: boolean;
};

const getOperation = async (projectId: string, operationId: string) => {
  const { data } = await v6.get<TOperation>(
    `/cloud/project/${projectId}/operation/${operationId}`,
  );
  return data;
};

export const useOperation = ({
  projectId,
  operationId,
  interval = 2000,
  onSuccess = () => {},
}: {
  projectId: string;
  operationId: string;
  interval?: number;
  onSuccess: () => void;
}) => {
  const [state, setState] = useState<TState>({
    opId: undefined,
    operation: undefined,
    isPending: false,
  });

  let intervalId: NodeJS.Timer;

  useEffect(() => {
    if (projectId && operationId) {
      setState((prev) => ({ ...prev, isPending: true }));
      if (intervalId) clearInterval(intervalId);
      intervalId = setInterval(async () => {
        const operation = await getOperation(projectId, operationId);
        setState((prev) => ({ ...prev, operation }));
        if (operation.status === 'completed') {
          clearInterval(intervalId);
          setState((prev) => ({ ...prev, isPending: false }));
          onSuccess();
        }
      }, interval);
    }
  }, [projectId, operationId]);

  return { operation: state.operation, isPending: state.isPending };
};
