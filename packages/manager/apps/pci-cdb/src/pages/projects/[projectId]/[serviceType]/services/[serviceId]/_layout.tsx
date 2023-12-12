import { useQuery } from '@tanstack/react-query';
import { Outlet, NavLink } from 'react-router-dom';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { H2 } from '@/components/typography';
import { cdbApi } from '@/data/cdbapi';

export const Handle = {
  breadcrumb: (params: { serviceId: string }) => params.serviceId,
};

export default function ServiceLayout() {
  const { projectId, serviceId } = useRequiredParams<{
    projectId: string;
    serviceId: string;
  }>();
  const serviceQuery = useQuery({
    queryKey: ['/services', projectId, serviceId],
    queryFn: () => cdbApi.getService(projectId, serviceId),
    refetchInterval: 30_000, // poll service every 30 sec
  });
  return (
    <>
      <H2>Dashboard</H2>
      <div className="flex gap-2 text-lg px-4">
        <NavLink
          to="general"
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? 'font-bold text-primary' : ''
          }
        >
          general
        </NavLink>
        <NavLink
          to="users"
          className={({ isActive, isPending }) =>
            isPending ? 'pending' : isActive ? 'font-bold text-primary' : ''
          }
        >
          users
        </NavLink>
      </div>
      <Outlet context={serviceQuery} />
    </>
  );
}
