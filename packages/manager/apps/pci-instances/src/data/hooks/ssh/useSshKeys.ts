import { useQuery } from '@tanstack/react-query';
import { getSshKeys } from '@/data/api/sshKeys';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TSshKey } from '@/domain/entities/configuration';
import { TSelectOptions } from '@/types/querySelectOptions.type';
import { sshKeysQueryKey } from '@/adapters/tanstack/configuration/queryKeys';

export const useSshKeys = <TData>(
  options: TSelectOptions<TSshKey[], TData>,
) => {
  const { select } = options;
  const projectId = useProjectId();

  return useQuery({
    queryKey: sshKeysQueryKey(projectId),
    queryFn: () => getSshKeys({ projectId }),
    select,
  });
};
