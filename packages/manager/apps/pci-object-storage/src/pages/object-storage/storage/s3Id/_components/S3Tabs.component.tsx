import { useTranslation } from 'react-i18next';
import { StorageContainer } from '@datatr-ux/ovhcloud-types/cloud/index';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';

interface S3TabsProps {
  s3: StorageContainer;
}
const S3Tabs = ({ s3 }: S3TabsProps) => {
  const { t } = useTranslation('pci-object-storage/storages/header-tabs');

  const tabs = [
    { href: 'dashboard', label: t('dashboardTab') },
    {
      href: 'objects',
      label: t('objectsTab'),
      count: s3.objects.length || 0,
    },
    {
      href: 'replication',
      label: t('replicationTab'),
      count: s3.replication?.rules?.length || 0,
    },
  ].filter((tab) => tab);

  return <TabsMenu tabs={tabs} />;
};

export default S3Tabs;
