import { Outlet, redirect, useParams } from 'react-router-dom';
import { Skeleton } from '@datatr-ux/uxlib';
import { POLLING } from '@/configuration/polling.constants';
import queryClient from '@/query.client';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import { getApp } from '@/data/api/ai/app/app.api';
import { AppLayoutContext } from './App.context';
import { AppHeader } from './_components/AppHeader.component';
import AppTabs from './_components/AppTabs.component';
import { useGetApp } from '@/data/hooks/ai/app/useGetApp.hook';

interface AppLayoutProps {
  params: {
    projectId: string;
    appId: string;
  };
  request: Request;
}
// try to fetch the service data, redirect to service page if it fails
export const Loader = async ({ params }: AppLayoutProps) => {
  const { projectId, appId } = params;
  return queryClient
    .fetchQuery({
      queryKey: [projectId, 'ai/app', appId],
      queryFn: () => getApp({ projectId, appId }),
    })
    .then(
      () => null,
      () => redirect(`/pci/projects/${projectId}/ai/notebooks/deploy`),
    );
};

function AppName() {
  const { projectId, appId } = useParams();
  if (!appId) return '';
  const appQuery = useGetApp(projectId, appId);
  return appQuery.isSuccess ? (
    appQuery.data.spec.name
  ) : (
    <Skeleton className="h-4 w-20 inline-block align-middle" />
  );
}

export function breadcrumb() {
  return <AppName />;
}

export default function AppLayout() {
  const { isUserActive } = useUserActivityContext();
  const { projectId, appId } = useParams();
  const appQuery = useGetApp(projectId, appId, {
    refetchInterval: isUserActive && POLLING.APP,
  });

  const app = appQuery.data;
  if (!app) {
    return (
      <>
        <AppHeader.Skeleton />
        <TabsMenu.Skeleton />
      </>
    );
  }
  const appLayoutContext: AppLayoutContext = {
    app,
    appQuery,
  };

  return (
    <>
      <AppHeader app={app} />
      <AppTabs app={app} />
      <div className="space-y-2">
        <Outlet context={appLayoutContext} />
      </div>
    </>
  );
}
