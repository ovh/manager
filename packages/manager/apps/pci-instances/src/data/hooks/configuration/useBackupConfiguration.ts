import { useQuery } from '@tanstack/react-query';
import { backupConfigurationQueryKey } from '@/adapters/tanstack/configuration/queryKeys';
import { getBackupConfiguration } from '@/data/api/backupConfiguration';
import { useProjectId } from '@/hooks/project/useProjectId';
import { TSelectOptions } from '@/types/querySelectOptions.type';
import { TBackupConfiguration } from '@/domain/entities/configuration';

export const useBackupConfigurations = <TData>(
  options: TSelectOptions<TBackupConfiguration[], TData>,
) => {
  const projectId = useProjectId();
  const { select } = options;

  return useQuery({
    queryKey: backupConfigurationQueryKey(projectId),
    queryFn: () => getBackupConfiguration({ projectId }),
    select,
  });
};
