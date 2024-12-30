import {
  Outlet,
  redirect,
  useLocation,
  useMatches,
  useParams,
} from 'react-router-dom';
import { useRouting, useShell } from '@ovh-ux/manager-react-shell-client';
import { useEffect } from 'react';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import queryClient from '@/query.client';
import { useLoadingIndicatorContext } from '@/contexts/LoadingIndicator.context';
import { getProject } from '@/data/api/project/project.api';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import { Toaster } from '@/components/ui/toaster';
import PageLayout from '@/components/page-layout/PageLayout.component';
import { UserActivityProvider } from '@/contexts/UserActivityContext';
import { USER_INACTIVITY_TIMEOUT } from '@/configuration/polling.constants';
import { useTrackPageAuto } from '@/hooks/useTracking';

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
// try to get project details from project id, redirect if the projectId is invalid
export const Loader = async ({ params }: NotebooksLayoutProps) => {
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
  const matches = useMatches();

  useEffect(() => {
    routing.stopListenForHashChange();
  }, []);
  useEffect(() => {
    shell.ux.hidePreloader();
    setLoading(false);
    routing.onHashChange();
  }, [location]);

  useEffect(() => {
    const match = matches.slice(-1);
    //  We cannot type properly useMatches cause it's not support type inference or passing specific type https://github.com/remix-run/react-router/discussions/10902
    defineCurrentPage(`app.pci-databases-analytics.${match[0].id}`);
  }, [location]);

  useTrackPageAuto();

  return <></>;
}

export function useNotebooksData() {
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
