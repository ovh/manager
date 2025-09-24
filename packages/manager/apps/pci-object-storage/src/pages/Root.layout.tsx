import { useEffect } from 'react';
import { Outlet, useLocation, redirect, useMatches } from 'react-router-dom';
import { useRouting, useShell } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import { Toaster } from '@datatr-ux/uxlib';
import PageLayout from '@/components/page-layout/PageLayout.component';
import Breadcrumb from '@/components/breadcrumb/Breadcrumb.component';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import queryClient from '@/query.client';
import { useLoadingIndicatorContext } from '@/contexts/LoadingIndicator.context';

import { useTrackPageAuto } from '@/hooks/useTracking';
import { getProject } from '@/data/api/project/project.api';
import { UserActivityProvider } from '@/contexts/UserActivityContext';
import { USER_INACTIVITY_TIMEOUT } from '@/configuration/polling.constants';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey={'crumb-object-storage'}
      namespace="pci-object-storage"
    />
  );
}

interface ServiceCategoryLayoutProps {
  params: {
    projectId: string;
  };
  request: Request;
}

export const Loader = ({ params }: ServiceCategoryLayoutProps) => {
  // check if we have a correct category
  const { projectId } = params;
  // check if we have a correct projectId
  return queryClient
    .fetchQuery({
      queryKey: ['projectId', projectId],
      queryFn: () => getProject(projectId),
    })
    .then(
      () => true,
      () => redirect(`/pci/projects`),
    );
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
    defineCurrentPage(`app.pci-object-storage.${match[0].id}`);
  }, [location]);

  useTrackPageAuto();

  return <></>;
}

export default function Layout() {
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
