import { useEffect } from 'react';
import { Outlet, useLocation, redirect, useMatches } from 'react-router-dom';
import { useRouting, useShell } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import PageLayout from '@/components/page-layout/PageLayout.component';
import Breadcrumb, {
  BreadcrumbHandleParams,
} from '@/components/breadcrumb/Breadcrumb.component';
import * as database from '@/types/cloud/project/database';
import { Toaster } from '@/components/ui/toaster';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';
import queryClient from '@/query.client';
import { UserActivityProvider } from '@/contexts/UserActivityContext';
import { getProject } from '@/data/api/project/project.api';
import { useLoadingIndicatorContext } from '@/contexts/LoadingIndicator.context';
import { USER_INACTIVITY_TIMEOUT } from '@/configuration/polling.constants';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return (
    <BreadcrumbItem
      translationKey={`crumb-${params.category}`}
      namespace="pci-databases-analytics"
    />
  );
}

interface ServiceCategoryLayoutProps {
  params: {
    projectId: string;
    category: string;
  };
  request: Request;
}

export const Loader = ({ params, request }: ServiceCategoryLayoutProps) => {
  // check if we have a correct category
  const { category, projectId } = params;
  if (
    !Object.values(database.engine.CategoryEnum).includes(
      category as database.engine.CategoryEnum,
    )
  ) {
    const path = request.url.replace(
      category,
      database.engine.CategoryEnum.all,
    );
    return redirect(path);
  }
  // check if we have a correct projectId
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
