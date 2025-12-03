import { useTranslation } from 'react-i18next';
import { StorageContainer } from '@datatr-ux/ovhcloud-types/cloud';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import { useIsLocaleZone } from '@/hooks/useIsLocalZone.hook';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';

interface S3TabsProps {
  s3: StorageContainer;
}
const S3Tabs = ({ s3 }: S3TabsProps) => {
  const { t } = useTranslation('pci-object-storage/storages/header-tabs');
  const { regions } = useObjectStorageData();
  const isLocaleZone = useIsLocaleZone(s3, regions);

  const tabs = [
    { href: 'dashboard', label: t('dashboardTab') },
    {
      href: 'objects',
      label: t('objectsTab'),
    },
    !isLocaleZone && {
      href: 'replication',
      label: t('replicationTab'),
      count: s3.replication?.rules?.length || 0,
    },
  ].filter((tab) => tab);

  return <TabsMenu tabs={tabs} />;
};

export default S3Tabs;
