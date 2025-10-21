/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsCard, OdsIcon, OdsText } from '@ovhcloud/ods-components/react';
import { Datagrid, DataGridTextCell } from '@ovh-ux/manager-react-components';

import { ManagerButton, useBytes } from '@ovh-ux/manager-react-components';

import { useDeleteNashaPartition } from '@/data/api/hooks/useNashaPartitions';
import type { NashaPartition } from '@/types/Nasha.type';

interface NashaPartitionsTabProps {
  serviceName: string;
  partitions: NashaPartition[];
}

export default function NashaPartitionsTab({ serviceName, partitions }: NashaPartitionsTabProps) {
  const { t } = useTranslation('dashboard');
  const { formatBytes } = useBytes();
  const deletePartition = useDeleteNashaPartition();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    partitionName: string;
  }>({
    isOpen: false,
    partitionName: '',
  });

  const handleDelete = (partitionName: string) => {
    setDeleteModal({
      isOpen: true,
      partitionName,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deletePartition.mutateAsync({
        serviceName,
        partitionName: deleteModal.partitionName,
      });
      setDeleteModal({ isOpen: false, partitionName: '' });
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const columns = [
    {
      id: 'partitionName',
      label: t('partition_name'),
      cell: (partition: NashaPartition) => (
        <DataGridTextCell>{partition.partitionName}</DataGridTextCell>
      ),
    },
    {
      id: 'size',
      label: t('size'),
      cell: (partition: NashaPartition) => (
        <DataGridTextCell>{formatBytes(partition.size * 1024 * 1024 * 1024)}</DataGridTextCell>
      ),
    },
    {
      id: 'used',
      label: t('used'),
      cell: (partition: NashaPartition) => (
        <DataGridTextCell>{formatBytes(typeof partition.use?.value === 'number' ? partition.use.value : 0)}</DataGridTextCell>
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
      id: 'path',
      label: t('path'),
      cell: (partition: NashaPartition) => (
        <DataGridTextCell>{partition.path}</DataGridTextCell>
      ),
    },
    {
      id: 'actions',
      label: t('actions'),
      cell: (partition: NashaPartition) => (
        <ManagerButton
          id={`delete-partition-${partition.partitionName}`}
          label={t('delete')}
          iamActions={['nasha:partition:delete']}
          urn={`urn:v1:eu:nasha:${serviceName}:partition:${partition.partitionName}`}
          onClick={() => handleDelete(partition.partitionName)}
        />
      ),
    },
  ];

  if (partitions.length === 0) {
    return (
      <div className="text-center py-12">
        <OdsIcon name={ODS_ICON_NAME.folder} className="mx-auto mb-4 text-neutral-400" />
        <OdsText preset="heading-3" className="mb-2">
          {t('no_partitions')}
        </OdsText>
        <OdsText preset="paragraph" color="neutral-600" className="mb-4">
          {t('no_partitions_description')}
        </OdsText>
        <ManagerButton
          id="create-partition"
          label={t('create_partition')}
          iamActions={['nasha:partition:create']}
          urn={`urn:v1:eu:nasha:${serviceName}`}
          onClick={() => {}} // TODO: Implement create partition modal
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <OdsText preset="heading-2">
          {t('partitions')} ({partitions.length})
        </OdsText>
        <ManagerButton
          id="create-partition"
          label={t('create_partition')}
          iamActions={['nasha:partition:create']}
          urn={`urn:v1:eu:nasha:${serviceName}`}
          onClick={() => {}} // TODO: Implement create partition modal
        />
      </div>

      <OdsCard className="p-6">
        <Datagrid
          columns={columns}
          items={partitions}
          totalItems={partitions.length}
          noResultLabel={t('no_partitions')}
        />
      </OdsCard>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <OdsCard className="p-6 max-w-md w-full mx-4">
            <OdsText preset="heading-3" className="mb-4">
              {t('delete_partition')}
            </OdsText>
            <OdsText preset="paragraph" className="mb-6">
              {t('delete_partition_confirmation', { partitionName: deleteModal.partitionName })}
            </OdsText>
            <div className="flex gap-3 justify-end">
              <ManagerButton
                id="cancel-delete-partition"
                label={t('cancel')}
                onClick={() => setDeleteModal({ isOpen: false, partitionName: '' })}
              />
              <ManagerButton
                id="confirm-delete-partition"
                label={t('delete')}
                iamActions={['nasha:partition:delete']}
                urn={`urn:v1:eu:nasha:${serviceName}:partition:${deleteModal.partitionName}`}
                onClick={handleConfirmDelete}
              />
            </div>
          </OdsCard>
        </div>
      )}
    </div>
  );
}
