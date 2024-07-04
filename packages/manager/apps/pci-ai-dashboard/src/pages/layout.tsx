import { Outlet, redirect, useLocation, useParams } from 'react-router-dom';
import { useRouting, useShell } from '@ovh-ux/manager-react-shell-client';

import { useEffect } from 'react';
import queryClient from '@/query.client';
import { getProject } from '@/data/api/projects';
import { useLoadingIndicatorContext } from '@/contexts/loadingIndicatorContext';

interface DashboardLayoutProps {
  params: {
    projectId: string;
  };
  request: Request;
}
// try to fetch the service data, redirect to service page if it fails
export const Loader = async ({ params }: DashboardLayoutProps) => {
  const { projectId } = params;
  return queryClient
    .fetchQuery({
      queryKey: ['projectId', projectId],
      queryFn: () => getProject(projectId),
    })
    .then(
      () => null,
      () => redirect(`/pci/projects`),
    );
};

function RoutingSynchronisation() {
  const { setLoading } = useLoadingIndicatorContext();
  const location = useLocation();
  const routing = useRouting();
  const shell = useShell();
  useEffect(() => {
    routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    shell.ux.hidePreloader();
    setLoading(false);
    routing.onHashChange();
  }, [location]);
  return <></>;
}

export function breadcrumb() {
  return 'ai-dashboard';
}

export function useDashboardData() {
  const { projectId } = useParams();
  return { projectId };
}

export default function DashboardLayout() {
  return (
    <>
      <RoutingSynchronisation />
      <Outlet />
    </>
  );
}
