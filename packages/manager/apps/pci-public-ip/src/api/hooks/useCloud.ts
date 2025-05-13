import { useQuery } from '@tanstack/react-query';
import { getMigrationSteins } from '@/api/data/cloud';

export const useMigrationSteins = () => {
  return useQuery({
    queryKey: ['migrationSteins'],
    queryFn: () => getMigrationSteins(),
    select: (data) =>
      data?.sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ),
  });
};
