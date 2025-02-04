import { useTranslation } from 'react-i18next';
import { useParams, Outlet } from 'react-router-dom';
import { POLLING } from '@/configuration/polling.constants';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import Guides from '@/components/guides/Guides.component';
import { allGuidesSections } from '@/configuration/guide';
import { useGetApps } from '@/hooks/api/ai/app/useGetApps.hook';
import AppsList from './_components/AppsListTable.component';

const Apps = () => {
  const { t } = useTranslation('pci-ai-deploy/apps');
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
        <Guides section={allGuidesSections} />
      </div>
      <AppsList apps={appQuery.data} />
      <Outlet />
    </>
  );
};

export default Apps;
