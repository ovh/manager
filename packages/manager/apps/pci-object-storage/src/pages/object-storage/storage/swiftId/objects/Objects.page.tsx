import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import { useSwiftData } from '../Swift.context';
import SwiftObjectsList from './_components/SwiftObjectListTable.component';
import Guides from '@/components/guides/Guides.component';
import RoadmapChangelog from '@/components/roadmap-changelog/RoadmapChangelog.component';

const Objects = () => {
  const { swift } = useSwiftData();
  const { t } = useTranslation('pci-object-storage/storages/swift/objects');
  return (
    <>
      <div className="flex justify-between w-full items-center">
        <h2>{t('objectTitle')}</h2>
        <div className="flex flex-wrap justify-end gap-1">
          <Guides selectors={['allGuides', 'gettingStarted']} />
          <RoadmapChangelog />
        </div>
      </div>
      <SwiftObjectsList objects={swift.objects || []} />
      <Outlet />
    </>
  );
};

export default Objects;
