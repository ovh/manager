import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  ICON_NAME,
  MESSAGE_COLOR,
  MODAL_COLOR,
  Message,
  MessageBody,
  MessageIcon,
} from '@ovhcloud/ods-react';

import { DeleteModalProps } from '@/components/delete-modal/DeleteModal.props';
import { Modal } from '@/components/modal/Modal.component';
import { Text } from '@/components/text/Text.component';

import './translations/translations';

export const DeleteModal: React.FC<DeleteModalProps> = ({
  open = true,
  serviceTypeName,
  isLoading,
  onConfirmDelete,
  onClose,
  error,
  children,
  onOpenChange,
}) => {
  const { t } = useTranslation('delete-modal');

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Modal
      type={MODAL_COLOR.critical}
      open={open}
      loading={isLoading}
      onOpenChange={onOpenChange}
      heading={t('deleteModalHeadline', {
        serviceType: serviceTypeName || t('deleteModalHeadlineService'),
      })}
      primaryButton={{
        label: t('deleteModalDeleteButton'),
        onClick: onConfirmDelete,
        testId: 'manager-delete-modal-confirm',
      }}
      secondaryButton={{
        label: t('deleteModalCancelButton'),
        onClick: handleClose,
        testId: 'manager-delete-modal-cancel',
      }}
    >
      <div className="flex flex-col gap-4">
        {error && (
          <Message color={MESSAGE_COLOR.warning}>
            <MessageIcon name={ICON_NAME.triangleExclamation} />
            <MessageBody>{t('deleteModalError', { error })}</MessageBody>
          </Message>
        )}
        <Text data-testid="manager-delete-modal-description" id="delete-modal-description">
          {t('deleteModalDescription')}
        </Text>
        {children && <>{children}</>}
      </div>
    </Modal>
  );
};
