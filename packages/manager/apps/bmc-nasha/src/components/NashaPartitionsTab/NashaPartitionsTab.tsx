/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Suspense, useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsCard, OdsIcon, OdsTable, OdsText } from '@ovhcloud/ods-components/react';

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
      header: t('partition_name'),
      accessorKey: 'partitionName',
    },
    {
      header: t('size'),
      accessorKey: 'size',
      cell: ({ row }: any) => formatBytes(row.original.size * 1024 * 1024 * 1024),
    },
    {
      header: t('used'),
      accessorKey: 'used',
      cell: ({ row }: any) => formatBytes(row.original.used * 1024 * 1024 * 1024),
    },
    {
      header: t('protocol'),
      accessorKey: 'protocol',
    },
    {
      header: t('path'),
      accessorKey: 'path',
    },
    {
      header: t('actions'),
      id: 'actions',
      cell: ({ row }: any) => (
        <ManagerButton
          id={`delete-partition-${row.original.partitionName}`}
          label={t('delete')}
          iamActions={['nasha:partition:delete']}
          urn={`urn:v1:eu:nasha:${serviceName}:partition:${row.original.partitionName}`}
          onClick={() => handleDelete(row.original.partitionName)}
        />
      ),
    },
  ];

  if (partitions.length === 0) {
    return (
      <div className="text-center py-12">
        <OdsIcon name={ODS_ICON_NAME.FOLDER} size="xl" className="mx-auto mb-4 text-neutral-400" />
        <OdsText preset="heading-3" className="mb-2">
          {t('no_partitions')}
        </OdsText>
        <OdsText preset="body-2" color="neutral-600" className="mb-4">
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
        <OdsTable columns={columns} data={partitions} className="w-full" />
      </OdsCard>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <OdsCard className="p-6 max-w-md w-full mx-4">
            <OdsText preset="heading-3" className="mb-4">
              {t('delete_partition')}
            </OdsText>
            <OdsText preset="body-1" className="mb-6">
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
