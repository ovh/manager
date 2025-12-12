import { useQuery } from '@tanstack/react-query';
import { getSshKeys } from '@/data/api/sshKeys';
import { useProjectId } from '@/hooks/project/useProjectId';
import { sshKeysQueryKey } from '@/adapters/tanstack/configuration/queryKeys';

export const useSshKeys = (region: string) => {
  const projectId = useProjectId();

  const { data, ...query } = useQuery({
    queryKey: sshKeysQueryKey(projectId, region),
    queryFn: () => getSshKeys({ projectId, region }),
  });

  return {
    data,
    ...query,
  };
};
