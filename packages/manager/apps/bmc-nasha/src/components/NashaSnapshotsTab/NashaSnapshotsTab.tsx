/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsCard, OdsIcon, OdsText } from '@ovhcloud/ods-components/react';
import { Datagrid, DataGridTextCell } from '@ovh-ux/manager-react-components';

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
      id: 'snapshotName',
      label: t('snapshot_name'),
      cell: (snapshot: NashaSnapshot) => (
        <DataGridTextCell>{snapshot.snapshotName}</DataGridTextCell>
      ),
    },
    {
      id: 'size',
      label: t('size'),
      cell: (snapshot: NashaSnapshot) => (
        <DataGridTextCell>{formatBytes(snapshot.size * 1024 * 1024 * 1024)}</DataGridTextCell>
      ),
    },
    {
      id: 'creationDate',
      label: t('creation_date'),
      cell: (snapshot: NashaSnapshot) => (
        <DataGridTextCell>{new Date(snapshot.creationDate).toLocaleDateString()}</DataGridTextCell>
      ),
    },
    {
      id: 'description',
      label: t('description'),
      cell: (snapshot: NashaSnapshot) => (
        <DataGridTextCell>{snapshot.description || '-'}</DataGridTextCell>
      ),
    },
  ];

  if (snapshots.length === 0) {
    return (
      <div className="text-center py-12">
        <OdsIcon name={ODS_ICON_NAME.camera} className="mx-auto mb-4 text-neutral-400" />
        <OdsText preset="heading-3" className="mb-2">
          {t('no_snapshots')}
        </OdsText>
        <OdsText preset="paragraph" color="neutral-600">
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
        <Datagrid
          columns={columns}
          items={snapshots}
          totalItems={snapshots.length}
          noResultLabel={t('no_snapshots')}
        />
      </OdsCard>
    </div>
  );
}
