import { useTranslation } from 'react-i18next';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import storages from '@/types/Storages';

const SwiftTabs = () => {
  const { t } = useTranslation('pci-object-storage/storages/header-tabs');

  const tabs = [
    { href: '', label: t('dashboardTab'), end: true },
    {
      href: 'objects',
      label: t('objectsTab'),
    },
  ].filter((tab) => tab);

  return <TabsMenu tabs={tabs} />;
};

export default SwiftTabs;
