import { useQuery } from '@tanstack/react-query';

import { getBackupServices } from '@/data/api/backup/backupServices.requests';

export const useBackupServicesId = () => {
  const { data, isPending, error } = useQuery({
    queryFn: () => getBackupServices(),
    queryKey: ['backupServiceId'],
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const id = data?.[0]?.id || '';

  return {
    backupServicesId: id,
    isPending,
    error,
  };
};
