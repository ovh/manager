import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovh-ux/manager-react-components';
import { getPlans } from '../data/plans';

export const useGetPlans = (projectId: string) => {
  const { me } = useMe();
  return useQuery({
    queryKey: ['project', projectId, 'plans'],
    queryFn: () => getPlans(projectId, me?.ovhSubsidiary),
    enabled: !!me,
    throwOnError: true,
  });
};
