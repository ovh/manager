import { queryOptions, useQuery, useQueryClient } from '@tanstack/react-query';

import { getBackupServices } from '@/data/api/backup/backupServices.requests';

const ONE_DAY_HOURS_IN_MS = 1000 * 60 * 60 * 24;

export const getBackupServicesOptions = () => {
  return queryOptions({
    queryFn: () => getBackupServices(),
    queryKey: ['backupServiceId'],
    staleTime: ONE_DAY_HOURS_IN_MS,
  });
};

export const useBackupServicesId = () => {
  return useQuery({
    ...getBackupServicesOptions(),
    select: (data) => data[0]?.id,
  });
};

export const useGetBackupServicesId = () => {
  const queryClient = useQueryClient();

  return async () => (await queryClient.ensureQueryData(getBackupServicesOptions()))[0]?.id;
};
