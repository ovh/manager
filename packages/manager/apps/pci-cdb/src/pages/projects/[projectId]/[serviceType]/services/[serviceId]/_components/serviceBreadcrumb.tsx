import { useGetService } from '@/hooks/api/useGetService';

export const ServiceBreadcrumb = ({
  projectId,
  serviceId,
}: {
  projectId: string;
  serviceId: string;
}) => {
  const serviceQuery = useGetService(projectId, serviceId);
  return serviceQuery.data?.description ?? serviceId;
};
