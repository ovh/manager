import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useGetServices } from '@/hooks/api/services.api.hooks';
import { database } from '@/models/database';
import ServicesList from './_components/serviceListTable';

const Services = () => {
  const { projectId, category } = useParams();
  const servicesQuery = useGetServices(projectId, { refetchInterval: 30_000 });
  const filteredServices = useMemo(() => {
    if (!servicesQuery.data) return [];
    return servicesQuery.data.filter(
      (service) =>
        category === database.CategoryEnum.all || service.category === category,
    );
  }, [servicesQuery.data, category]);
  if (servicesQuery.isLoading) return <ServicesList.Skeleton />;
  return (
    <ServicesList
      services={filteredServices}
      refetchFn={servicesQuery.refetch}
    />
  );
};

export default Services;
