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
import { Toaster } from '@datatr-ux/uxlib';
import queryClient from '@/query.client';
import { useTrackPageAuto } from '@/hooks/useTracking';
import { useLoadingIndicatorContext } from '@/contexts/LoadingIndicator.context';
import { getProject } from '@/data/api/project/project.api';
import { USER_INACTIVITY_TIMEOUT } from '@/configuration/polling.constants';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import PageLayout from '@/components/page-layout/PageLayout.component';
import { UserActivityProvider } from '@/contexts/UserActivityContext';

export function breadcrumb() {
  return (
    <BreadcrumbItem translationKey="Notebooks" namespace="pci-ai-notebooks" />
  );
}

interface AILayoutProps {
  params: {
    projectId: string;
  };
  request: Request;
}
// try to get project details from project id, redirect if the projectId is invalid
export const Loader = async ({ params }: AILayoutProps) => {
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
    defineCurrentPage(`app.pci-ai-tools.${match[0].id}`);
  }, [location]);

  useTrackPageAuto();

  return <></>;
}

export function useAIData() {
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
