import { useEffect } from 'react';
import { Outlet, useLocation, redirect } from 'react-router-dom';
import { useRouting, useShell } from '@ovh-ux/manager-react-shell-client';
import PageLayout from '@/components/PageLayout/PageLayout';
import Breadcrumb, {
  BreadcrumbHandleParams,
} from '@/components/Breadcrumb/Breadcrumb';
import { Toaster } from '@/components/ui/toaster';
import BreadcrumbItem from '@/components/Breadcrumb/BreadcrumbItem';
import queryClient from '@/query.client';
import { getProject } from '@/data/api/projects';
import { useLoadingIndicatorContext } from '@/contexts/loadingIndicatorContext';

export function breadcrumb({ params }: BreadcrumbHandleParams) {
  return (
    <BreadcrumbItem
      translationKey={`crumb-${params.category}`}
      namespace="pci-ai-dashboard"
    />
  );
}/*
interface ServiceCategoryLayoutProps {
  params: {
    projectId: string;
  };
  request: Request;
}

export const Loader = ({ params, request }: ServiceCategoryLayoutProps) => {
  // check if we have a correct category
  const { projectId } = params;
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
*/
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

export default function Layout() {
  return (
    <PageLayout>
      <Breadcrumb />
      <RoutingSynchronisation />
      <Outlet />
      <Toaster />
    </PageLayout>
  );
}
