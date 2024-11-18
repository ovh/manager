import { useQuery } from '@tanstack/react-query';
import { TProject } from '@ovh-ux/manager-pci-common';
import { useMemo } from 'react';
import { getService, getServiceInfos, getServices } from '@/api/data/service';

export const useServices = () =>
  useQuery({
    queryKey: ['services'],
    queryFn: () => getServices(),
  });

export const useProjectService = (project: TProject) => {
  const query = useServices();
  const service = useMemo(() => {
    return query.data?.find(
      (s) =>
        s?.resource?.name === project.project_id ||
        s?.resource?.name === project.projectName,
    );
  }, [query.data, project]);

  return {
    ...query,
    services: query.data,
    data: service,
  };
};

export const useGetServiceInfos = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'serviceInfos'],
    queryFn: () => getServiceInfos(projectId),
  });

export const useGetProjectService = (projectId: string) => {
  const query = useGetServiceInfos(projectId);

  return useQuery({
    queryKey: ['project', projectId, 'service'],
    queryFn: () => getService(query.data?.serviceId),
    enabled: !!query.data?.serviceId,
  });
};
