/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { OdsCard, OdsIcon, OdsText } from '@ovhcloud/ods-components/react';

import { ManagerButton, Datagrid, DataGridTextCell } from '@ovh-ux/manager-react-components';

import { useDeleteNashaAccess } from '@/data/api/hooks/useNashaAccess';
import type { NashaAccess } from '@/types/Nasha.type';

interface NashaAccessTabProps {
  serviceName: string;
  access: NashaAccess[];
}

export default function NashaAccessTab({ serviceName, access }: NashaAccessTabProps) {
  const { t } = useTranslation('dashboard');
  const deleteAccess = useDeleteNashaAccess();

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    ip: string;
  }>({
    isOpen: false,
    ip: '',
  });

  const handleDelete = (ip: string) => {
    setDeleteModal({
      isOpen: true,
      ip,
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deleteAccess.mutateAsync({
        serviceName,
        ip: deleteModal.ip,
      });
      setDeleteModal({ isOpen: false, ip: '' });
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  const columns = [
    {
      id: 'ip',
      label: t('ip_address'),
      cell: (access: NashaAccess) => (
        <DataGridTextCell>{access.ip}</DataGridTextCell>
      ),
    },
    {
      id: 'type',
      label: t('type'),
      cell: (access: NashaAccess) => (
        <DataGridTextCell>
          <span
            className={`px-2 py-1 rounded text-xs ${
              access.type === 'readwrite'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}
          >
            {access.type}
          </span>
        </DataGridTextCell>
      ),
    },
    {
      id: 'description',
      label: t('description'),
      cell: (access: NashaAccess) => (
        <DataGridTextCell>{access.description || '-'}</DataGridTextCell>
      ),
    },
    {
      id: 'actions',
      label: t('actions'),
      cell: (access: NashaAccess) => (
        <ManagerButton
          id={`delete-access-${access.ip}`}
          label={t('delete')}
          iamActions={['nasha:access:delete']}
          urn={`urn:v1:eu:nasha:${serviceName}:access:${access.ip}`}
          onClick={() => handleDelete(access.ip)}
        />
      ),
    },
  ];

  if (access.length === 0) {
    return (
      <div className="text-center py-12">
        <OdsIcon name={ODS_ICON_NAME.shield} className="mx-auto mb-4 text-neutral-400" />
        <OdsText preset="heading-3" className="mb-2">
          {t('no_access_rules')}
        </OdsText>
        <OdsText preset="paragraph" color="neutral-600" className="mb-4">
          {t('no_access_rules_description')}
        </OdsText>
        <ManagerButton
          id="create-access"
          label={t('create_access_rule')}
          iamActions={['nasha:access:create']}
          urn={`urn:v1:eu:nasha:${serviceName}`}
          onClick={() => {}} // TODO: Implement create access modal
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <OdsText preset="heading-2">
          {t('access_rules')} ({access.length})
        </OdsText>
        <ManagerButton
          id="create-access"
          label={t('create_access_rule')}
          iamActions={['nasha:access:create']}
          urn={`urn:v1:eu:nasha:${serviceName}`}
          onClick={() => {}} // TODO: Implement create access modal
        />
      </div>

      <OdsCard className="p-6">
        <Datagrid
          columns={columns}
          items={access}
          totalItems={access.length}
          noResultLabel={t('no_access_rules')}
        />
      </OdsCard>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <OdsCard className="p-6 max-w-md w-full mx-4">
            <OdsText preset="heading-3" className="mb-4">
              {t('delete_access_rule')}
            </OdsText>
            <OdsText preset="paragraph" className="mb-6">
              {t('delete_access_rule_confirmation', { ip: deleteModal.ip })}
            </OdsText>
            <div className="flex gap-3 justify-end">
              <ManagerButton
                id="cancel-delete-access"
                label={t('cancel')}
                onClick={() => setDeleteModal({ isOpen: false, ip: '' })}
              />
              <ManagerButton
                id="confirm-delete-access"
                label={t('delete')}
                iamActions={['nasha:access:delete']}
                urn={`urn:v1:eu:nasha:${serviceName}:access:${deleteModal.ip}`}
                onClick={handleConfirmDelete}
              />
            </div>
          </OdsCard>
        </div>
      )}
    </div>
  );
}
