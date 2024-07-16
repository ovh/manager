import {
  Outlet,
  redirect,
  useOutletContext,
  useParams,
} from 'react-router-dom';
import { UseQueryResult } from '@tanstack/react-query';
import { useGetService } from '@/hooks/api/services.api.hooks';
import { Skeleton } from '@/components/ui/skeleton';
import LegalMentions from '@/pages/_components/LegalMentions.component';
import { database } from '@/interfaces/database';
import { ServiceHeader } from './_components/ServiceHeader.component';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import { POLLING } from '@/configuration/polling.constants';
import { getService } from '@/data/api/databases/service';
import queryClient from '@/query.client';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import ServiceTabs from './_components/ServiceTabs.component';

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
  const { isUserActive } = useUserActivityContext();
  const { projectId, serviceId } = useParams();
  const serviceQuery = useGetService(projectId, serviceId, {
    refetchInterval: isUserActive && POLLING.SERVICE,
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

  return (
    <>
      <ServiceHeader service={service} />
      <ServiceTabs service={service} />
      <div className="space-y-2">
        <Outlet context={serviceLayoutContext} />
      </div>
      <LegalMentions className="mt-4" />
    </>
  );
}
