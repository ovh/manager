/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsCard, OdsIcon, OdsTable, OdsText } from '@ovhcloud/ods-components/react';

import { useBytes } from '@ovh-ux/manager-react-components';

import type { NashaSnapshot } from '@/types/Nasha.type';

interface NashaSnapshotsTabProps {
  serviceName: string;
  snapshots: NashaSnapshot[];
}

export default function NashaSnapshotsTab({ serviceName, snapshots }: NashaSnapshotsTabProps) {
  const { t } = useTranslation('dashboard');
  const { formatBytes } = useBytes();

  const columns = [
    {
      header: t('snapshot_name'),
      accessorKey: 'snapshotName',
    },
    {
      header: t('size'),
      accessorKey: 'size',
      cell: ({ row }: any) => formatBytes(row.original.size * 1024 * 1024 * 1024),
    },
    {
      header: t('creation_date'),
      accessorKey: 'creationDate',
      cell: ({ row }: any) => new Date(row.original.creationDate).toLocaleDateString(),
    },
    {
      header: t('description'),
      accessorKey: 'description',
      cell: ({ row }: any) => row.original.description || '-',
    },
  ];

  if (snapshots.length === 0) {
    return (
      <div className="text-center py-12">
        <OdsIcon name={ODS_ICON_NAME.CAMERA} size="xl" className="mx-auto mb-4 text-neutral-400" />
        <OdsText preset="heading-3" className="mb-2">
          {t('no_snapshots')}
        </OdsText>
        <OdsText preset="body-2" color="neutral-600">
          {t('no_snapshots_description')}
        </OdsText>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <OdsText preset="heading-2">
          {t('snapshots')} ({snapshots.length})
        </OdsText>
      </div>

      <OdsCard className="p-6">
        <OdsTable columns={columns} data={snapshots} className="w-full" />
      </OdsCard>
    </div>
  );
}
