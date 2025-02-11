import { Outlet, redirect, useLocation, useParams } from 'react-router-dom';
import { useRouting, useShell } from '@ovh-ux/manager-react-shell-client';
import { useEffect } from 'react';
import queryClient from '@/query.client';
import { useLoadingIndicatorContext } from '@/contexts/LoadingIndicator.context';
import { getProject } from '@/data/api/project/project.api';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { Toaster } from '@/components/ui/toaster';
import PageLayout from '@/components/page-layout/PageLayout.component';

import { UserActivityProvider } from '@/contexts/UserActivity.context';
import { USER_INACTIVITY_TIMEOUT } from '@/configuration/polling';
import { useTrackPageAuto } from '@/hooks/useTracking';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey={`AI Dashboard`}
      namespace="pci-ai-dashboard"
    />
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
  // check if we have a correct projectId
  try {
    await queryClient.fetchQuery({
      queryKey: ['projectId', projectId],
      queryFn: () => getProject(projectId),
    });
  } catch (_error) {
    return redirect(`/pci/projects`);
  }
  return null;
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

  useTrackPageAuto();

  return <></>;
}

export function useDashboardData() {
  const { projectId } = useParams();
  return { projectId };
}

export default function Layout() {
  return (
    <PageLayout>
      <UserActivityProvider timeout={USER_INACTIVITY_TIMEOUT}>
        <RoutingSynchronisation />
        <Outlet />
        <Toaster />
      </UserActivityProvider>
    </PageLayout>
  );
}
