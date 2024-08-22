import { useQuery } from '@tanstack/react-query';
import { useMe } from '@ovh-ux/manager-react-components';
import { getProjectsAvailableVolumes } from '@/api/data/availableVolumes';

export const getProjectsAvailableVolumesQuery = (
  projectId: string,
  ovhSubsidiary: string,
) => ({
  queryKey: ['project', projectId, 'availableVolumes'],
  queryFn: () => getProjectsAvailableVolumes(projectId, ovhSubsidiary),
});

export const useProjectsAvailableVolumes = (projectId: string) => {
  const { me } = useMe();
  return useQuery({
    ...getProjectsAvailableVolumesQuery(projectId, me?.ovhSubsidiary),
    enabled: !!me,
  });
};
