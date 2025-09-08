import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { OdsDivider } from '@ovhcloud/ods-components/react';

import { QuickAccess } from './components/QuickAccess.component';
import { QuickAccessItem } from './components/QuickAccessCard.component';
import { Others, OtherActionItem } from './components/Others.component';
import { DiscoveryBanner } from './components/DiscoveryBanner.component';
import DashboardTiles from './components/DashboardTiles.component';

import IconInstances from '@/assets/home/instances.svg?url';
import IconKubernetes from '@/assets/home/managed_kubernetes_service.svg?url';
import IconObjectStorage from '@/assets/home/object_storage.svg?url';
import IconNetwork from '@/assets/home/vrack_private_network.svg?url';
import IconDatabase from '@/assets/home/managed_mongodb.svg?url';
import IconBlockStorage from '@/assets/home/block_storage.svg?url';

export default function Home() {
  const { t } = useTranslation('project');

  const quickAccessItems: QuickAccessItem[] = useMemo(
    () => [
      {
        icon: IconInstances,
        title: t('pci_projects_project_instances'),
        description: t('pci_projects_project_create_instance'),
        link: `instances/new`,
      },
      {
        icon: IconKubernetes,
        title: t('pci_projects_project_kubernetes'),
        description: t('pci_projects_project_create_cluster'),
        link: `kubernetes/new`,
      },
      {
        icon: IconObjectStorage,
        title: t('pci_projects_project_object_storage'),
        description: t('pci_projects_project_create_container'),
        link: `storages/objects/new`,
      },
      {
        icon: IconBlockStorage,
        title: t('pci_projects_project_block_storage'),
        description: t('pci_projects_project_create_volume'),
        link: `storages/blocks`,
      },
      {
        icon: IconNetwork,
        title: t('pci_projects_project_network'),
        description: t('pci_projects_project_manage_vrack'),
        link: `private-networks`,
      },
      {
        icon: IconDatabase,
        title: t('pci_projects_project_database'),
        description: t('pci_projects_project_create_database'),
        link: `databases-analytics/operational/services/new`,
      },
    ],
    [t],
  );

  const otherActionsItems: OtherActionItem[] = useMemo(
    () => [
      {
        icon: 'book',
        label: t('pci_projects_project_create_ai_notebook'),
        link: `ai-ml/auth`,
      },
      {
        icon: 'network',
        label: t('pci_projects_project_create_load_balancer'),
        link: `octavia-load-balancer/load-balancers`,
      },
      {
        icon: 'bill',
        label: t('pci_projects_project_billing'),
        link: `billing`,
      },
      {
        icon: 'cog',
        label: t('pci_projects_project_quotas'),
        link: `quota`,
      },
    ],
    [t],
  );

  return (
    <>
      <DiscoveryBanner className="mb-6 w-full" />
      <QuickAccess items={quickAccessItems} />
      <Others items={otherActionsItems} />
      <OdsDivider className="my-8 block" />
      <DashboardTiles />
    </>
  );
}
