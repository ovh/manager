import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';

import QuickAccessCard from './QuickAccessCard.component';
import { DASHBOARD_QUICK_ACCESS_ITEMS_BASE, DashboardItem } from '@/constants';
import { useDashboardLinks } from '@/hooks/home/useDashboardLinks';
import { useDashboardItemsFilteredByFA } from '@/hooks/useDashboardItemsFilteredByFA';

import IconInstances from '@/assets/home/instances.svg?url';
import IconKubernetes from '@/assets/home/managed_kubernetes_service.svg?url';
import IconObjectStorage from '@/assets/home/object_storage.svg?url';
import IconNetwork from '@/assets/home/vrack_private_network.svg?url';
import IconDatabase from '@/assets/home/managed_mongodb.svg?url';
import IconBlockStorage from '@/assets/home/block_storage.svg?url';

// Map label translation keys to their corresponding icons
const iconMap: Record<string, string> = {
  pci_projects_home_instances: IconInstances,
  pci_projects_home_kubernetes: IconKubernetes,
  pci_projects_home_object_storage: IconObjectStorage,
  pci_projects_home_block_storage: IconBlockStorage,
  pci_projects_home_network: IconNetwork,
  pci_projects_home_database: IconDatabase,
};

function QuickAccess() {
  const { t } = useTranslation('home');

  // Filter items by feature flags first
  const filteredItems = useDashboardItemsFilteredByFA(
    DASHBOARD_QUICK_ACCESS_ITEMS_BASE,
  );

  // Add iconImage to filtered items using label translation key mapping
  const itemsWithIcons: DashboardItem[] = filteredItems.map((item) => ({
    ...item,
    iconImage: item.labelTranslationKey
      ? iconMap[item.labelTranslationKey]
      : undefined,
  }));

  const itemsWithLinksAndIcons = useDashboardLinks(itemsWithIcons);

  return (
    <>
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t('pci_projects_home_quick_access')}
      </OdsText>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-5 m-6">
        {itemsWithLinksAndIcons.map((item, idx) => (
          <QuickAccessCard key={idx} item={item} index={idx} />
        ))}
      </div>
    </>
  );
}

export default QuickAccess;
