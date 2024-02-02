import { UseQueryResult } from '@tanstack/react-query';
import { Outlet } from 'react-router-dom';
import { useGetService } from '@/hooks/api/services.api.hooks';
import TabsMenu from '@/components/tabs-menu';
import { database } from '@/models/database';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { ServiceHeader } from './_components/serviceHeader';
import { ServiceBreadcrumb } from './_components/serviceBreadcrumb';

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

export type ServiceLayoutContext = {
  service: database.Service;
  serviceQuery: UseQueryResult<database.Service, Error>;
};
export default function ServiceLayout() {
  const { projectId, serviceId } = useRequiredParams<{
    projectId: string;
    serviceId: string;
  }>();
  const serviceQuery = useGetService(projectId, serviceId, {
    refetchInterval: 30_000,
  });

  const service = serviceQuery.data;
  if (!service) {
    return (
      <>
        <ServiceHeader.Skeleton />
        <TabsMenu.Skeleton />
        Loading your service data
      </>
    );
  }
  const serviceLayoutContext: ServiceLayoutContext = {
    service,
    serviceQuery,
  };
  const tabs = [
    { href: 'general', label: 'Dashboard' },
    { href: 'users', label: 'Users' },
    { href: 'logs', label: 'Logs' },
    { href: 'backups', label: 'Backups' },
    { href: 'databases', label: 'Databases' },
    { href: 'integrations', label: 'Integrations' },
    { href: 'metrics', label: 'Metrics' },
    { href: 'namespaces', label: 'Namespaces' },
    { href: 'pools', label: 'Pools' },
    { href: 'queries', label: 'Queries' },
    { href: 'settings', label: 'Settings' },
  ];
  return (
    <>
      <ServiceHeader service={service} />
      <TabsMenu tabs={tabs} />
      <Outlet context={serviceLayoutContext} />
    </>
  );
}
