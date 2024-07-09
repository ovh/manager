import { Outlet, redirect, useLocation, useParams } from 'react-router-dom';
import { useRouting, useShell } from '@ovh-ux/manager-react-shell-client';

import { useEffect } from 'react';
import queryClient from '@/query.client';

import { useLoadingIndicatorContext } from '@/contexts/loadingIndicatorContext';
import { getProject } from '@/data/api/apiProjects';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import BreadcrumbItem from '@/components/Breadcrumb/BreadcrumbItem';
import PageLayout from '@/components/PageLayout/PageLayout';
import { Toaster } from '@/components/ui/toaster';

export function breadcrumb() {
  return (
    <BreadcrumbItem translationKey={`test`} namespace="pci-ai-dashboard" />
  );
}

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

export function useDashboardData() {
  const { projectId } = useParams();
  return { projectId };
}

export default function DashboardLayout() {
  return (
    <PageLayout>
      <Breadcrumb />
      <RoutingSynchronisation />
      <Outlet />
      <Toaster />
    </PageLayout>
  );
}
