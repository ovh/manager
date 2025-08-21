import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Message,
  MessageBody,
  MessageIcon,
  MODAL_COLOR,
  MESSAGE_COLOR,
  ICON_NAME,
} from '@ovhcloud/ods-react';
import './translations/translations';
import { Modal } from '../modal';
import { Text } from '../text';
import { DeleteModalProps } from './DeleteModal.props';

export const DeleteModal: React.FC<DeleteModalProps> = ({
  open = false,
  serviceTypeName,
  isLoading,
  onConfirmDelete,
  onClose,
  error,
  children,
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
        <Text
          data-testid="manager-delete-modal-description"
          id="delete-modal-description"
        >
          {t('deleteModalDescription')}
        </Text>
        {children && <>{children}</>}
      </div>
    </Modal>
  );
};
