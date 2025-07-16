import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { OdsDivider } from '@ovhcloud/ods-components/react';

import {
  QuickAccess,
  QuickAccessItem,
} from './components/QuickAccess.component';
import { Others, OtherActionItem } from './components/Others.component';
import DashboardTiles from './components/DashboardTiles.component';

import IconInstances from '@/assets/home/Instances.svg?url';
import IconKubernetes from '@/assets/home/Managed Kubernetes Service.svg?url';
import IconObjectStorage from '@/assets/home/Object Storage.svg?url';
import IconNetwork from '@/assets/home/vRack Private Network.svg?url';
import IconDatabase from '@/assets/home/Managed MongoDB.svg?url';
import IconBlockStorage from '@/assets/home/Block Storage.svg?url';

export default function Home() {
  const { t } = useTranslation('home');
  const { projectId } = useParams<{ projectId: string }>();

  if (!projectId) {
    throw Error(t('project_identifier_missing'));
  }

  const quickAccessItems: QuickAccessItem[] = useMemo(
    () => [
      {
        icon: IconInstances,
        title: t('instances'),
        description: t('create_instance'),
        link: `instances/new`,
      },
      {
        icon: IconKubernetes,
        title: t('kubernetes'),
        description: t('create_cluster'),
        link: `kubernetes/new`,
      },
      {
        icon: IconObjectStorage,
        title: t('object_storage'),
        description: t('create_container'),
        link: `storages/objects/new`,
      },
      {
        icon: IconBlockStorage,
        title: t('block_storage'),
        description: t('create_volume'),
        link: `storages/blocks`,
      },
      {
        icon: IconNetwork,
        title: t('network'),
        description: t('manage_vrack'),
        link: `private-networks`,
      },
      {
        icon: IconDatabase,
        title: t('database'),
        description: t('create_database'),
        link: `databases-analytics/operational/services/new`,
      },
    ],
    [t],
  );

  const otherActionsItems: OtherActionItem[] = useMemo(
    () => [
      {
        icon: 'book',
        label: t('create_ai_notebook'),
        link: `ai-ml/auth`,
      },
      {
        icon: 'network',
        label: t('create_load_balancer'),
        link: `octavia-load-balancer/load-balancers`,
      },
      {
        icon: 'bill',
        label: t('billing'),
        link: `billing`,
      },
      {
        icon: 'cog',
        label: t('quotas'),
        link: `quota`,
      },
    ],
    [t],
  );

  return (
    <>
      <QuickAccess items={quickAccessItems} />
      <Others items={otherActionsItems} />
      <OdsDivider className="my-8 block" />
      <DashboardTiles projectId={projectId} />
    </>
  );
}
