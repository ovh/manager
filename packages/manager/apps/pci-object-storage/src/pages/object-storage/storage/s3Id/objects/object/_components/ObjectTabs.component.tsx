import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import TabsMenu, { Tab } from '@/components/tabs-menu/TabsMenu.component';

const ObjectTabs = ({ versionsCount }: { versionsCount: number }) => {
  const { t } = useTranslation('pci-object-storage/storages/s3/objects');
  const [searchParams] = useSearchParams();
  const objectKey = searchParams.get('objectKey');

  const tabs: Tab[] = [
    {
      href: `.?objectKey=${encodeURIComponent(objectKey)}`,
      label: t('propertiesTab'),
      end: true,
    },
    {
      href: `versions?objectKey=${encodeURIComponent(objectKey)}`,
      label: t('versionsTab'),
      count: versionsCount,
    },
  ];

  return <TabsMenu tabs={tabs} />;
};

export default ObjectTabs;
