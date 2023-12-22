import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { cdbApi } from '@/data/cdbapi';
import ServicesList from './_components/serviceListTable';
import { database } from '@/models/database';
import { getServiceType } from '@/utils/databaseUtils';
import Onboarding from './_components/onboarding';
import { useRequiredParams } from '@/hooks/useRequiredParams';

export default function ServicePage() {
  // const [services, setServices] = useState<database.Service[]>([]);
  const { projectId, serviceType } = useRequiredParams<{
    projectId: string;
    serviceType: database.ServiceTypeEnum;
  }>();

  const getDatabaseListQueryKey = ['/services', projectId];

  const servicesQuery = useQuery({
    queryKey: getDatabaseListQueryKey,
    queryFn: () => cdbApi.getServices(projectId),
    refetchInterval: 30_000, // poll services every 30 sec
  });

  const filteredServices = useMemo(() => {
    if (!servicesQuery.data) return [];
    return servicesQuery.data.filter(
      (service) =>
        serviceType === database.ServiceTypeEnum.all ||
        getServiceType(service.engine) === serviceType,
    );
  }, [servicesQuery.data, serviceType]);

  const refetch = () => {
    servicesQuery.refetch();
  };

  if (servicesQuery.isLoading) return <ServicesList.Skeleton />;

  if (servicesQuery.error)
    return <pre>{JSON.stringify(servicesQuery.error)}</pre>;

  return (
    <>
      {filteredServices.length > 0 ? (
        <ServicesList
          services={filteredServices}
          projectId={projectId}
          refetchFn={refetch}
        />
      ) : (
        <Onboarding serviceType={serviceType} />
      )}
    </>
  );
}
