import { useTranslation } from 'react-i18next';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ResourceLocationCell } from '@/components/CommonCells/ResourceLocationCell/ResourceLocationCell.components';
import { ResourceRegionCell } from '@/components/CommonCells/ResourceRegionCell/ResourceRegionCell.components';
import {Bucket} from "@/types/Bucket.type";
import { NAMESPACES } from "@ovh-ux/manager-common-translations";
import {BucketNameCell} from "@/pages/vaults/dashboard/buckets/_components/BucketNameCell.component";

export const useBucketColumns = () => {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.VAULT_LISTING, NAMESPACES.DASHBOARD, NAMESPACES.REGION]);

  return [
    {
      id: 'name',
      cell: (bucket: Bucket) => <BucketNameCell id={bucket.id} name={bucket.name} />,
      label: t(`${NAMESPACES.DASHBOARD}:name`),
    },
    {
      id: 'location',
      cell: (bucket: Bucket) => <ResourceLocationCell region={bucket.region} />,
      label: t(`${NAMESPACES.REGION}:localisation`),
    },
    {
      id: 'region',
      cell: (bucket: Bucket) => <ResourceRegionCell region={bucket.region} />,
      label: t(`${NAMESPACES.REGION}:region`),
    },
  ];
};
