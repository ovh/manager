import { useQuery } from '@tanstack/react-query';
import { getServiceOptions } from '@/api/data/service-option';
import { RX_PLAN_CODE_PATTERN } from '@/constants';

export const useGetFilteredServiceOptions = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'serviceOptions'],
    queryFn: () => getServiceOptions(projectId),
    select: (data) =>
      data
        .filter((option) => option.family === 'quota')
        .sort((a, b) => {
          return (
            Number(RX_PLAN_CODE_PATTERN.exec(a.planCode)[1]) -
            Number(RX_PLAN_CODE_PATTERN.exec(b.planCode)[1])
          );
        }),
  });
