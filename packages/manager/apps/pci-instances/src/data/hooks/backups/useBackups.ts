import { backupsQueryKey } from '@/adapters/tanstack/backups/queryKeys';
import { getBackups, TGetBackupsQueryParams } from '@/data/api/backups';
import { TBackup } from '@/domain/entities/backup';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TSelectOptions } from '@/types/querySelectOptions.type';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export const useBackups = <TData>(
  region: string,
  options: TSelectOptions<TBackup[], TData> &
    Pick<UseQueryOptions<TBackup[], Error, TData>, 'enabled'>,
  params: TGetBackupsQueryParams,
) => {
  const { select, enabled } = options;
  const projectId = useProjectId();

  return useQuery({
    queryKey: backupsQueryKey(projectId, region, params),
    queryFn: () => getBackups({ projectId, region, params }),
    select,
    enabled,
  });
};
