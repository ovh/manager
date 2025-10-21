import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Datagrid, DataGridTextCell, ManagerButton, ActionMenu } from '@ovh-ux/manager-react-components';

import { SpaceMeter } from '@/components/SpaceMeter';
import type { NashaPartition } from '@/types/Nasha.type';

interface PartitionsTabProps {
  serviceName: string;
  partitions: NashaPartition[];
  onPartitionCreate: () => void;
  onPartitionDelete: (partition: NashaPartition) => void;
  onPartitionEditSize: (partition: NashaPartition) => void;
  onPartitionZfsOptions: (partition: NashaPartition) => void;
}

export const PartitionsTab = ({
  serviceName,
  partitions,
  onPartitionCreate,
  onPartitionDelete,
  onPartitionEditSize,
  onPartitionZfsOptions
}: PartitionsTabProps) => {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  const handleGoToPartition = (partitionName: string) => {
    navigate(`/dashboard/${serviceName}/partition/${partitionName}`);
  };

  const handleGoToSnapshots = (partitionName: string) => {
    navigate(`/dashboard/${serviceName}/partition/${partitionName}/snapshots`);
  };

  const handleGoToAccess = (partitionName: string) => {
    navigate(`/dashboard/${serviceName}/partition/${partitionName}/access`);
  };

  const columns = useMemo(() => [
    {
      id: 'partitionName',
      label: t('partition_name'),
      cell: (partition: NashaPartition) => (
        <DataGridTextCell>
          <ManagerButton
            id={`view-partition-${partition.partitionName}`}
            variant="ghost"
            label={partition.partitionName}
            onClick={() => handleGoToPartition(partition.partitionName)}
          />
        </DataGridTextCell>
      ),
    },
    {
      id: 'protocol',
      label: t('protocol'),
      cell: (partition: NashaPartition) => (
        <DataGridTextCell>{partition.protocol}</DataGridTextCell>
      ),
    },
    {
      id: 'usage',
      label: t('usage'),
      cell: (partition: NashaPartition) => (
        partition.use ? (
          <SpaceMeter
            usage={partition.use as any}
            help={false}
            large={false}
          />
        ) : (
          <DataGridTextCell>-</DataGridTextCell>
        )
      ),
    },
    {
      id: 'description',
      label: t('description'),
      cell: (partition: NashaPartition) => (
        <DataGridTextCell>{partition.description || '-'}</DataGridTextCell>
      ),
    },
    {
      id: 'actions',
      label: t('actions'),
      cell: (partition: NashaPartition) => (
        <ActionMenu
          id={`partition-actions-${partition.partitionName}`}
          items={[
            {
              id: 1,
              label: t('view'),
              onClick: () => handleGoToPartition(partition.partitionName)
            },
            {
              id: 2,
              label: t('snapshots'),
              onClick: () => handleGoToSnapshots(partition.partitionName)
            },
            {
              id: 3,
              label: t('access'),
              onClick: () => handleGoToAccess(partition.partitionName)
            },
            {
              id: 4,
              label: t('edit_size'),
              onClick: () => onPartitionEditSize(partition)
            },
            {
              id: 5,
              label: t('zfs_options'),
              onClick: () => onPartitionZfsOptions(partition)
            },
            {
              id: 6,
              label: t('delete'),
              onClick: () => onPartitionDelete(partition)
            },
          ]}
        />
      ),
    },
  ], [t, handleGoToPartition, handleGoToSnapshots, handleGoToAccess, onPartitionEditSize, onPartitionZfsOptions, onPartitionDelete]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-semibold">{t('partitions_title')}</h4>
        <ManagerButton
          id="create-partition"
          label={t('create_partition')}
          onClick={onPartitionCreate}
          icon="plus"
        />
      </div>

      <Datagrid
        columns={columns}
        items={partitions}
        totalItems={partitions.length}
        noResultLabel={t('no_partitions')}
      />
    </div>
  );
};
