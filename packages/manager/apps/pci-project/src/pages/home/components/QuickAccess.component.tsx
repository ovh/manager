import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';

import QuickAccessCard from './QuickAccessCard.component';
import { DASHBOARD_QUICK_ACCESS_ITEMS_BASE, DashboardItem } from '@/constants';
import { useDashboardLinks } from '@/hooks/home/useDashboardLinks';

import IconInstances from '@/assets/home/instances.svg?url';
import IconKubernetes from '@/assets/home/managed_kubernetes_service.svg?url';
import IconObjectStorage from '@/assets/home/object_storage.svg?url';
import IconNetwork from '@/assets/home/vrack_private_network.svg?url';
import IconDatabase from '@/assets/home/managed_mongodb.svg?url';
import IconBlockStorage from '@/assets/home/block_storage.svg?url';

const iconImages = [
  IconInstances,
  IconKubernetes,
  IconObjectStorage,
  IconBlockStorage,
  IconNetwork,
  IconDatabase,
];

// Add iconImage to items from constants
const itemsWithIcons: DashboardItem[] = DASHBOARD_QUICK_ACCESS_ITEMS_BASE.map(
  (item, index) => ({
    ...item,
    iconImage: iconImages[index],
  }),
);

function QuickAccess() {
  const { t } = useTranslation('home');

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
