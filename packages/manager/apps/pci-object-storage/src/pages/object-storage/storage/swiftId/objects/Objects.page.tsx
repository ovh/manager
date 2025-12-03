import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Skeleton } from '@datatr-ux/uxlib';
import { Plus } from 'lucide-react';
import { useSwiftData } from '../Swift.context';
import Guides from '@/components/guides/Guides.component';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import SwiftObjectBrowser from './_components/SwiftObjectBrowser.component';
import RefreshButton from '@/components/refresh-button/RefreshButton.component';
import BreadcrumbItem from '@/components/breadcrumb/BreadcrumbItem.component';

export function breadcrumb() {
  return (
    <BreadcrumbItem
      translationKey="objectsTab"
      namespace="pci-object-storage/storages/header-tabs"
    />
  );
}

const SwiftObjectsPage = () => {
  const { t } = useTranslation('pci-object-storage/storages/swift/objects');
  const { swiftQuery } = useSwiftData();
  const navigate = useNavigate();

  if (swiftQuery.isLoading) return <Skeleton className="h-96 w-full" />;
  const objects = swiftQuery.data.objects || [];
  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('objectTitle')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <Guides selectors={['allGuides', 'gettingStarted']} />
          <RoadmapChangelog />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <RefreshButton
          onClick={swiftQuery.refetch}
          isLoading={swiftQuery.isFetching}
        />
        <Button onClick={() => navigate('./add-object')}>
          <Plus className="size-6" />
          {t('addNewObject')}
        </Button>
      </div>

      <SwiftObjectBrowser objects={objects} />
      <Outlet />
    </>
  );
};

export default SwiftObjectsPage;
