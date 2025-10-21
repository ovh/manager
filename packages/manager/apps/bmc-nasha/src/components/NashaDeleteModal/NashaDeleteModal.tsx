import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { ManagerButton, Modal } from '@ovh-ux/manager-react-components';

import { useDeleteNashaService } from '@/data/api/hooks/useNashaServices';

interface NashaDeleteModalProps {
  isOpen: boolean;
  serviceName: string;
  serviceDisplayName?: string;
  onClose: () => void;
}

export default function NashaDeleteModal({
  isOpen,
  serviceName,
  serviceDisplayName,
  onClose,
}: NashaDeleteModalProps) {
  const { t } = useTranslation('listing');
  const deleteService = useDeleteNashaService();

  const handleDelete = async () => {
    try {
      await deleteService.mutateAsync(serviceName);
      onClose();
    } catch (error) {
      // Error handling is done in the mutation hook
    }
  };

  return (
    <Modal
      heading={t('delete_service')}
      type={ODS_MODAL_COLOR.critical}
      isOpen={isOpen}
      onDismiss={onClose}
      primaryLabel={t('delete')}
      secondaryLabel={t('cancel')}
      onPrimaryButtonClick={handleDelete}
      onSecondaryButtonClick={onClose}
      isPrimaryButtonLoading={deleteService.isPending}
      isPrimaryButtonDisabled={deleteService.isPending}
    >
      <div className="space-y-4">
        <OdsText preset="paragraph">
          {t('delete_service_confirmation', {
            serviceName: serviceDisplayName || serviceName,
          })}
        </OdsText>

        <OdsText preset="paragraph" color="neutral-600">
          {t('delete_service_warning')}
        </OdsText>

        <div className="bg-neutral-50 p-4 rounded-lg">
          <OdsText preset="caption" color="neutral-600">
            {t('service_name')}: {serviceName}
          </OdsText>
        </div>
      </div>
    </Modal>
  );
}
