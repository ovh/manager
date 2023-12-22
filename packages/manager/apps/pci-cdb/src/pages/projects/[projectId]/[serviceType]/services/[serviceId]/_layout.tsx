import { Outlet, NavLink } from 'react-router-dom';
import { useRequiredParams } from '@/hooks/useRequiredParams';
import { H2 } from '@/components/typography';
import { useGetService } from '@/hooks/api/useGetService';

export const Handle = {
  breadcrumb: (params: { serviceId: string }) => params.serviceId,
};

export default function ServiceLayout() {
  const { projectId, serviceId } = useRequiredParams<{
    projectId: string;
    serviceId: string;
  }>();
  const serviceQuery = useGetService(projectId, serviceId, {
    refetchInterval: 30_000,
  });
  const tabs = [
    { href: 'general', label: 'Dashboard' },
    { href: 'users', label: 'Users' },
  ];
  return (
    <>
      <H2>{serviceQuery.data?.description ?? 'Dashboard'}</H2>

      {/* TODO: Replace for a correct tabs like MUI's one */}
      <div className="relative flex overflow-x-auto mb-4 w-full border-b">
        <div className="flex">
          {tabs.map((tab, index) => (
            <NavLink
              to={tab.href}
              key={index}
              className={({ isActive }) =>
                isActive
                  ? 'px-4 py-2 bg-blue-500 text-white'
                  : 'px-4 py-2  bg-gray-200'
              }
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
      </div>

      <Outlet context={serviceQuery} />
    </>
  );
}
