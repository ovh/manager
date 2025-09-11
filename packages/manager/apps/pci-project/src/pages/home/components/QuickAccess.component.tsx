import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';

import QuickAccessCard from './QuickAccessCard.component';
import { DashboardTileItem } from '../DashboardTile.types';

import IconInstances from '@/assets/home/instances.svg?url';
import IconKubernetes from '@/assets/home/managed_kubernetes_service.svg?url';
import IconObjectStorage from '@/assets/home/object_storage.svg?url';
import IconNetwork from '@/assets/home/vrack_private_network.svg?url';
import IconDatabase from '@/assets/home/managed_mongodb.svg?url';
import IconBlockStorage from '@/assets/home/block_storage.svg?url';

const quickAccessItems: DashboardTileItem[] = [
  {
    iconImage: IconInstances,
    labelTranslationKey: 'pci_projects_project_instances',
    descriptionTranslationKey: 'pci_projects_project_create_instance',
    link: `instances/new`,
  },
  {
    iconImage: IconKubernetes,
    labelTranslationKey: 'pci_projects_project_kubernetes',
    descriptionTranslationKey: 'pci_projects_project_create_cluster',
    link: `kubernetes/new`,
  },
  {
    iconImage: IconObjectStorage,
    labelTranslationKey: 'pci_projects_project_object_storage',
    descriptionTranslationKey: 'pci_projects_project_create_container',
    link: `storages/objects/new`,
  },
  {
    iconImage: IconBlockStorage,
    labelTranslationKey: 'pci_projects_project_block_storage',
    descriptionTranslationKey: 'pci_projects_project_create_volume',
    link: `storages/blocks`,
  },
  {
    iconImage: IconNetwork,
    labelTranslationKey: 'pci_projects_project_network',
    descriptionTranslationKey: 'pci_projects_project_manage_vrack',
    link: `private-networks`,
  },
  {
    iconImage: IconDatabase,
    labelTranslationKey: 'pci_projects_project_database',
    descriptionTranslationKey: 'pci_projects_project_create_database',
    link: `databases-analytics/operational/services/new`,
  },
];

function QuickAccess() {
  const { t } = useTranslation('project');

  return (
    <>
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t('pci_projects_project_quick_access')}
      </OdsText>
      <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-5 m-6">
        {quickAccessItems.map((item, idx) => (
          <QuickAccessCard key={idx} item={item} index={idx} />
        ))}
      </div>
    </>
  );
}

export default QuickAccess;
