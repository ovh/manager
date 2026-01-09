import { useQuery } from '@tanstack/react-query';
import { getSshKeys } from '@/data/api/sshKeys';
import { useProjectId } from '@/hooks/project/useProjectId';
import { sshKeysQueryKey } from '@/adapters/tanstack/configuration/queryKeys';
import { TSshKey } from '@/domain/entities/configuration';

export const useSshKeys = <TData>(
  region: string,
  options: { select: (data?: TSshKey[]) => TData },
) => {
  const { select } = options;
  const projectId = useProjectId();

  return useQuery({
    queryKey: sshKeysQueryKey(projectId, region),
    queryFn: () => getSshKeys({ projectId, region }),
    select,
  });
};
