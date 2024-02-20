import { Outlet, useParams } from 'react-router-dom';
import { useGetService } from '@/hooks/api/services.api.hooks';
import { Skeleton } from '@/components/ui/skeleton';

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
  return (
    <>
      <p>Service</p>
      <ServiceName />
      <Outlet />
    </>
  );
}
