import { useTranslation } from 'react-i18next';
import { useParams, Outlet, redirect } from 'react-router-dom';
import { POLLING } from '@/configuration/polling.constants';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import Guides from '@/components/guides/Guides.component';
import { appGuidesSections } from '@/configuration/guide';
import AppsList from './_components/AppsListTable.component';
import { useGetApps } from '@/data/hooks/ai/app/useGetApps.hook';
import queryClient from '@/query.client';
import { getApps } from '@/data/api/ai/app/app.api';

interface AppsProps {
  params: {
    projectId: string;
  };
  request: Request;
}

export const Loader = async ({ params }: AppsProps) => {
  const { projectId } = params;
  const apps = await queryClient.fetchQuery({
    queryKey: [projectId, 'ai', 'app'],
    queryFn: () => getApps({ projectId }),
  });
  if (apps.length === 0) {
    return redirect(`/pci/projects/${projectId}/ai-ml/deploy/onboarding`);
  }
  return null;
};

const Apps = () => {
  const { t } = useTranslation('ai-tools/apps');
  const { projectId } = useParams();
  const { isUserActive } = useUserActivityContext();
  const appQuery = useGetApps(projectId, {
    refetchInterval: isUserActive && POLLING.APPS,
  });

  if (appQuery.isLoading) return <AppsList.Skeleton />;
  return (
    <>
      <div
        data-testid="apps-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('title')}</h2>
        <Guides section={appGuidesSections} />
      </div>
      <AppsList apps={appQuery.data} />
      <Outlet />
    </>
  );
};

export default Apps;
