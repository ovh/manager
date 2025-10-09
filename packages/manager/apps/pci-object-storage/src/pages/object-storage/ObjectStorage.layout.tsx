import { Outlet, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import DashboardTabs from './_components/ObjectStorageTabs.component';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { useGetStorages } from '@/data/hooks/storage/useGetStorages.hook';
import { useGetUsers } from '@/data/hooks/user/useGetUsers.hook';
import { useGetUsersWithS3Credentials } from '@/data/hooks/user/useGetUsersWithS3Credentials.hook';
import { POLLING } from '@/configuration/polling.constants';
import StoragesList from './storage/_components/StorageListTable.component';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import { useGetRegions } from '@/data/hooks/region/useGetRegions.hook';

export default function DashboardLayout() {
  const { t } = useTranslation('pci-object-storage');
  const { isUserActive } = useUserActivityContext();
  const { projectId } = useParams();
  const storagesQuery = useGetStorages(projectId, {
    refetchInterval: isUserActive && POLLING.CONTAINERS,
  });
  const usersQuery = useGetUsers(projectId, {
    refetchInterval: isUserActive && POLLING.USERS,
  });

  const regionQuery = useGetRegions(projectId);


  if (
    usersQuery.isLoading ||
    storagesQuery.isLoading ||
    regionQuery.isLoading
  ) {
    return (
      <>
        <TabsMenu.Skeleton />
        <StoragesList.Skeleton />
      </>
    );
  }

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
      <p>{t('description')}</p>
      <DashboardTabs
        storages={storagesQuery.data.resources}
        users={usersQuery.data}
      />
      <div className="space-y-2">
        <Outlet />
      </div>
    </>
  );
}
