import { useTranslation } from 'react-i18next';
import { StorageContainer } from '@datatr-ux/ovhcloud-types/cloud/index';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';

interface S3TabsProps {
  s3: StorageContainer;
}
const S3Tabs = ({ s3 }: S3TabsProps) => {
  const { t } = useTranslation('pci-object-storage/storages/header-tabs');

  const tabs = [
    { href: '', label: t('dashboardTab'), end: true },
    { href: 'objects', label: t('objectsTab'), count: s3.objectsCount || 0 },
    { href: 'replication', label: t('replicationTab') },
    { href: 'logs', label: t('logsTab') },
    { href: 'settings', label: t('settingsTab') },
  ].filter((tab) => tab);

  return <TabsMenu tabs={tabs} />;
};

export default S3Tabs;
