import { useMemo } from 'react';
import ServicesList from './_components/serviceListTable';
import { database } from '@/models/database';
import { getServiceType } from '@/utils/databaseUtils';
import Onboarding from './_components/onboarding';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { useGetServices } from '@/hooks/api/services.api.hooks'; 

export default function ServicePage() {
  const { projectId, serviceType } = useRequiredParams<{
    projectId: string;
    serviceType: database.ServiceTypeEnum;
  }>();
  const servicesQuery = useGetServices(projectId, { refetchInterval: 30_000 });

  const filteredServices = useMemo(() => {
    if (!servicesQuery.data) return [];
    return servicesQuery.data.filter(
      (service) =>
        serviceType === database.ServiceTypeEnum.all ||
        getServiceType(service.engine) === serviceType,
    );
  }, [servicesQuery.data, serviceType]);

  if (servicesQuery.isLoading) return <ServicesList.Skeleton />;

  if (servicesQuery.error)
    return <pre>{JSON.stringify(servicesQuery.error)}</pre>;

  return (
    <>
      {filteredServices.length > 0 ? (
        <ServicesList
          services={filteredServices}
          projectId={projectId}
          refetchFn={servicesQuery.refetch}
        />
      ) : (
        <Onboarding serviceType={serviceType} />
      )}
    </>
  );
}
