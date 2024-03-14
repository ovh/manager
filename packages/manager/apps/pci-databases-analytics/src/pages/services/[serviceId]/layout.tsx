import {
  Outlet,
  redirect,
  useNavigate,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import { UseQueryResult } from '@tanstack/react-query';
import { useGetService } from '@/hooks/api/services.api.hooks';
import { Skeleton } from '@/components/ui/skeleton';
import LegalMentions from '@/pages/_components/legalMentions';
import { database } from '@/models/database';
import { ServiceHeader } from './_components/serviceHeader';
import TabsMenu from '@/components/tabs-menu';
import { POLLING } from '@/configuration/polling';
import { getService } from '@/api/databases/service';
import queryClient from '@/query.client';

interface ServiceLayoutProps {
  params: {
    projectId: string;
    serviceId: string;
    category: string;
  };
  request: Request;
}
// try to fetch the service data, redirect to service page if it fails
export const Loader = async ({ params }: ServiceLayoutProps) => {
  const { projectId, serviceId, category } = params;
  return queryClient
    .fetchQuery({
      queryKey: [projectId, 'database/service', serviceId],
      queryFn: () => getService({ projectId, serviceId }),
    })
    .then(
      () => null,
      () =>
        redirect(
          `/pci/projects/${projectId}/databases-analytics/${category}/services`,
        ),
    );
};

function ServiceName() {
  const { projectId, serviceId } = useParams();
  if (!serviceId) return '';
  const serviceQuery = useGetService(projectId, serviceId);
  return serviceQuery.isSuccess ? (
    serviceQuery.data.description
  ) : (
    <Skeleton className="h-4 w-20 inline-block align-middle" />
  );
}

export function breadcrumb() {
  return <ServiceName />;
}

// Share data with the child routes
type ServiceLayoutContext = {
  service: database.Service;
  serviceQuery: UseQueryResult<database.Service, Error>;
};
export function useServiceData() {
  const { projectId, category } = useParams();
  const { service, serviceQuery } = useOutletContext() as ServiceLayoutContext;
  return { projectId, category, service, serviceQuery };
}

export default function ServiceLayout() {
  const { projectId, serviceId } = useParams();
  const serviceQuery = useGetService(projectId, serviceId, {
    refetchInterval: POLLING.SERVICE,
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
    { href: '', label: 'Dashboard', end: true },
    service.capabilities.users && {
      href: 'users',
      label: 'Users',
      disabled: !service.capabilities.users.read,
    },
    service.capabilities.backups && {
      href: 'backups',
      label: 'Backups',
      disabled: !service.capabilities.backups.read,
    },
    service.capabilities.databases && {
      href: 'databases',
      label: 'Databases',
      disabled: !service.capabilities.databases.read,
    },
    service.capabilities.namespaces && {
      href: 'namespaces',
      label: 'Namespaces',
      disabled: !service.capabilities.namespaces.read,
    },
    service.capabilities.connectionPools && {
      href: 'pools',
      label: 'Pools',
      disabled: !service.capabilities.connectionPools.read,
    },
    service.capabilities.queryStatistics && {
      href: 'queries',
      label: 'Queries',
      disabled: !service.capabilities.queryStatistics.read,
    },
    service.capabilities.integrations && {
      href: 'integrations',
      label: 'Integrations',
      disabled: !service.capabilities.integrations.read,
    },
    { href: 'metrics', label: 'Metrics' },
    { href: 'logs', label: 'Logs' },
    { href: 'settings', label: 'Settings' },
  ].filter((t) => t);

  return (
    <>
      <ServiceHeader service={service} />
      <TabsMenu tabs={tabs} />
      <div className="space-y-2">
        <Outlet context={serviceLayoutContext} />
      </div>
      <LegalMentions
        showRedisMessage={
          serviceQuery.data?.engine === database.EngineEnum.redis
        }
        className="mt-4"
      />
    </>
  );
}
