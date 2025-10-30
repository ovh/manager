import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';
import { Button, Skeleton } from '@datatr-ux/uxlib';
import { Plus } from 'lucide-react';
import { useSwiftData } from '../Swift.context';
import Guides from '@/components/guides/Guides.component';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';
import SwiftObjectBrowser from './_components/SwiftObjectBrowser.component';

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

      <Button onClick={() => navigate('./add-object')}>
        <Plus className="size-6 mr-2 text-primary-foreground" />
        {t('addNewObject')}
      </Button>

      <SwiftObjectBrowser objects={objects} />
      <Outlet />
    </>
  );
};

export default SwiftObjectsPage;
