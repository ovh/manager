import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { getOperations } from '@/data/api/operation';
import { TOperation } from '@/types/operation/entity.type';
import { isInstanceCreationOperationInProgress } from '@/utils/operation/operations.utils';
import { useProjectId } from '@/hooks/project/useProjectId';

export type TUseOperationsQueryOptions = Pick<
  UseQueryOptions<TOperation[]>,
  'enabled' | 'retry' | 'gcTime' | 'refetchOnWindowFocus'
>;

export const useOperations = (
  projectId: string,
  options: TUseOperationsQueryOptions = {},
) =>
  useQuery<TOperation[]>({
    queryKey: [projectId, 'operations'],
    queryFn: () => getOperations(projectId),
    ...options,
  });

export const useHasPendingInstanceCreationOperations = () => {
  const projectId = useProjectId();

  const { data: operations, isPending, isError } = useOperations(projectId);

  if (isError) {
    return { hasPendingInstanceCreationOperations: false, isPending: false };
  }

  return {
    hasPendingInstanceCreationOperations: operations?.some(
      isInstanceCreationOperationInProgress,
    ),
    isPending,
  };
};
