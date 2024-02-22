import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useGetServices } from '@/hooks/api/services.api.hooks';
import { database } from '@/models/database';
import ServicesList from './_components/serviceListTable';
import Onboarding from './_components/onboarding';
import LegalMentions from '../_components/legalMentions';

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
  const hasRedisService =
    filteredServices.filter((s) => s.engine === database.EngineEnum.redis)
      .length > 0;
  if (servicesQuery.isLoading) return <ServicesList.Skeleton />;
  if (servicesQuery.isSuccess && filteredServices.length === 0) {
    return <Onboarding />;
  }
  return (
    <>
      <ServicesList
        services={filteredServices}
        refetchFn={servicesQuery.refetch}
      />
      <LegalMentions showRedisMessage={hasRedisService} className="mt-4" />
    </>
  );
};

export default Services;
