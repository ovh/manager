import { Outlet, useParams } from 'react-router-dom';
import { useGetService } from '@/hooks/api/services.api.hooks';
import { Skeleton } from '@/components/ui/skeleton';
import LegalMentions from '@/pages/_components/legalMentions';
import { database } from '@/models/database';

function ServiceName() {
  const { projectId, serviceId } = useParams();
  const serviceQuery = useGetService(projectId, serviceId);
  return serviceQuery.isLoading ? (
    <Skeleton className="h-4 w-20 inline-block align-middle" />
  ) : (
    serviceQuery.data.description
  );
}

export function breadcrumb() {
  return <ServiceName />;
}

export default function ServiceLayout() {
  const { projectId, serviceId } = useParams();
  const serviceQuery = useGetService(projectId, serviceId);
  return (
    <>
      <p>Service</p>
      <ServiceName />
      <Outlet />
      <LegalMentions
        showRedisMessage={
          serviceQuery.data?.engine === database.EngineEnum.redis
        }
        className="mt-4"
      />
    </>
  );
}
