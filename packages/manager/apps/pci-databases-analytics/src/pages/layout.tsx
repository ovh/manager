import { useEffect } from 'react';
import { Outlet, useLocation, redirect, useMatches } from 'react-router-dom';
import { useRouting, useShell } from '@ovh-ux/manager-react-shell-client';
import { defineCurrentPage } from '@ovh-ux/request-tagger';
import PageLayout from '@/components/PageLayout/PageLayout';
import Breadcrumb, {
  BreadcrumbHandleParams,
} from '@/components/Breadcrumb/Breadcrumb';
import { database } from '@/models/database';
import { Toaster } from '@/components/ui/toaster';
import BreadcrumbItem from '@/components/Breadcrumb/BreadcrumbItem';
import queryClient from '@/query.client';
import { getProject } from '@/api/projects';
import { useLoadingIndicatorContext } from '@/contexts/loadingIndicatorContext';
import { UserActivityProvider } from '@/contexts/userActivityContext';
import { USER_INACTIVITY_TIMEOUT } from '@/configuration/polling';

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
    !Object.values(database.CategoryEnum).includes(
      category as database.CategoryEnum,
    )
  ) {
    const path = request.url.replace(category, database.CategoryEnum.all);
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
