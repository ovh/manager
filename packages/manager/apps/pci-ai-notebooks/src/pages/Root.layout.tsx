import { Outlet, redirect, useLocation, useParams } from 'react-router-dom';
import { useRouting, useShell } from '@ovh-ux/manager-react-shell-client';

import { useEffect } from 'react';
import queryClient from '@/query.client';

import { useLoadingIndicatorContext } from '@/contexts/LoadingIndicator.context';
import { getProject } from '@/data/api/project/project.api';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

import { Toaster } from '@/components/ui/toaster';
import PageLayout from '@/components/page-layout/PageLayout.component';
import Auth from './auth/auth.page';
import { UserActivityProvider } from '@/contexts/UserActivityContext';
import { USER_INACTIVITY_TIMEOUT } from '@/configuration/polling.constants';
import { useGetAuthorization } from '@/hooks/api/ai/authorization/useGetAuthorization.hook';

export function breadcrumb() {
  return (
    <BreadcrumbItem translationKey="Notebooks" namespace="pci-ai-notebooks" />
  );
}

interface NotebooksLayoutProps {
  params: {
    projectId: string;
  };
  request: Request;
}
// try to fetch the service data, redirect to service page if it fails
export const Loader = async ({ params }: NotebooksLayoutProps) => {
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

export function useNotebooksData() {
  const { projectId } = useParams();
  return { projectId };
}

export default function Layout() {
  const { projectId } = useParams();
  const authorizationQuery = useGetAuthorization(projectId);
  if (authorizationQuery.isSuccess && authorizationQuery.data.authorized) {
    return (
      <PageLayout>
        <UserActivityProvider timeout={USER_INACTIVITY_TIMEOUT}>
          <Breadcrumb />
          <RoutingSynchronisation />
          <Outlet />
          <Toaster />
        </UserActivityProvider>
      </PageLayout>
    );
  }
  return (
    <PageLayout>
      <UserActivityProvider timeout={USER_INACTIVITY_TIMEOUT}>
        <RoutingSynchronisation />
        <Auth
          onSuccess={() => {
            authorizationQuery.refetch();
          }}
        />
        <Toaster />
      </UserActivityProvider>
    </PageLayout>
  );
}
