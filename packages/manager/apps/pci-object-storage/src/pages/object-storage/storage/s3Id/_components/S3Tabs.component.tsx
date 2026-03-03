import { useTranslation } from 'react-i18next';
import { StorageContainer } from '@datatr-ux/ovhcloud-types/cloud';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import { useIsLocaleZone } from '@/hooks/useIsLocalZone.hook';
import { useObjectStorageData } from '@/pages/object-storage/ObjectStorage.context';
import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { useParams } from 'react-router-dom';
import { useGetS3Lifecycle } from '@/data/hooks/s3-storage/useGetS3Lifecycle.hook';

interface S3TabsProps {
  s3: StorageContainer;
}
const S3Tabs = ({ s3 }: S3TabsProps) => {
  const { t } = useTranslation('pci-object-storage/storages/header-tabs');
  const { projectId, region, s3Name } = useParams();
  const { regions } = useObjectStorageData();
  const isLocaleZone = useIsLocaleZone(s3, regions);
  const { data: featuresAvailable } = useFeatureAvailability([
    'pci-object-storage:manage-lifecycle',
  ]);

  const lifecycleQuery = useGetS3Lifecycle({
    projectId,
    region,
    name: s3Name,
  });

  const isManageLifecycleFeatureAvailable =
    featuresAvailable?.['pci-object-storage:manage-lifecycle'];

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
    !isLocaleZone &&
    isManageLifecycleFeatureAvailable && {
      href: 'lifecycle',
      label: t('lifecycleTab'),
      count: lifecycleQuery.data?.rules?.length || 0,
    },
  ].filter((tab) => tab);

  return <TabsMenu tabs={tabs} />;
};

export default S3Tabs;
