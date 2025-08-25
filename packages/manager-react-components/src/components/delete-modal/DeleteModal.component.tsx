import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Message,
  MessageBody,
  MessageIcon,
  BUTTON_VARIANT,
  BUTTON_COLOR,
  MODAL_COLOR,
  TEXT_PRESET,
  MESSAGE_COLOR,
  ICON_NAME,
} from '@ovhcloud/ods-react';
import { handleClick } from '../../utils/click-utils';
import './translations/translations';
import { Modal } from '../modal';
import { Button } from '../button';
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
      aria-labelledby="delete-modal-title"
      aria-describedby="delete-modal-description"
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
      <section className="flex flex-col gap-4" role="dialog" aria-modal="true">
        {error && (
          <section aria-live="polite" aria-atomic="true">
            <Message color={MESSAGE_COLOR.warning} role="alert">
              <MessageIcon name={ICON_NAME.triangleExclamation} />
              <MessageBody>{t('deleteModalError', { error })}</MessageBody>
            </Message>
          </section>
        )}
        <main>
          <Text
            data-testid="manager-delete-modal-description"
            id="delete-modal-description"
          >
            {t('deleteModalDescription')}
          </Text>
          {children && (
            <section aria-label={t('deleteModalAdditionalContent')}>
              {children}
            </section>
          )}
        </main>
      </section>
    </Modal>
  );
};
