import { useQuery } from '@tanstack/react-query';
import { getBackups } from '@/data/api/pci-volume-backup';

export const useBackups = (projectId: string | undefined) =>
  useQuery({
    queryKey: [
      'pci-volume-backup',
      `/cloud/project/${projectId}/aggregated/volumeBackup`,
    ],
    queryFn: () => getBackups(projectId as NonNullable<typeof projectId>),
    enabled: !!projectId,
  });
