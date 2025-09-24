import { Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { useGetStorages } from '@/data/hooks/storage/useGetStorages.hook';
import { POLLING } from '@/configuration/polling.constants';
import ContainersList from './_components/ContainerListTable.component';

const Containers = () => {
  const { t } = useTranslation('pci-object-storage/containers');
  const { projectId } = useParams();
  const { isUserActive } = useUserActivityContext();
  const containersQuery = useGetStorages(projectId, {
    refetchInterval: isUserActive && POLLING.CONTAINERS,
  });

  if (containersQuery.isLoading) return <ContainersList.Skeleton />;
  return (
    <>
      <div
        data-testid="containers-guides-container"
        className="flex justify-between w-full items-center"
      >
        <h2>{t('title')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <RoadmapChangelog />
          {/* <Guides
            section={GuideSections.landing}
            noEngineFilter
            onGuideClick={(guide) =>
              track(TRACKING.servicesList.guideClick(guide.title))
            }
          /> */}
        </div>
      </div>
      <ContainersList containers={containersQuery?.data.resources || []} />
      <Outlet />
    </>
  );
};

export default Containers;
