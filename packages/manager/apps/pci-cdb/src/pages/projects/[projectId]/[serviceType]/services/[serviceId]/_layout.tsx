import { Outlet } from 'react-router-dom';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { H2 } from '@/components/typography';
import { useGetService } from '@/hooks/api/useGetService';
import TabsMenu from '@/components/tabs-menu';

const ServiceBreadcrumb = ({
  projectId,
  serviceId,
}: {
  projectId: string;
  serviceId: string;
}) => {
  const serviceQuery = useGetService(projectId, serviceId);
  return serviceQuery.data?.description ?? serviceId;
};

export const Handle = {
  breadcrumb: (params: { projectId: string; serviceId: string }) => {
    return (
      <ServiceBreadcrumb
        projectId={params.projectId}
        serviceId={params.serviceId}
      />
    );
  },
};

export default function ServiceLayout() {
  const { projectId, serviceId } = useRequiredParams<{
    projectId: string;
    serviceId: string;
  }>();
  const serviceQuery = useGetService(projectId, serviceId, {
    refetchInterval: 30_000,
  });
  const tabs = [
    { href: 'general', label: 'Dashboard' },
    { href: 'users', label: 'Users' },
  ];
  return (
    <>
      <H2>{serviceQuery.data?.description ?? 'Dashboard'}</H2>
      <TabsMenu tabs={tabs} />
      <Outlet context={serviceQuery} />
    </>
  );
}
