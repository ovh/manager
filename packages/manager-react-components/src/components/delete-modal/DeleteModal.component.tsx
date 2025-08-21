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
    >
      <section className="flex flex-col gap-4" role="dialog" aria-modal="true">
        <header>
          <Text
            preset={TEXT_PRESET.heading3}
            id="delete-modal-title"
            role="heading"
            aria-level={2}
          >
            {t('deleteModalHeadline', {
              serviceType: serviceTypeName || t('deleteModalHeadlineService'),
            })}
          </Text>
        </header>

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

        <footer className="flex justify-end gap-2">
          <Button
            slot="actions"
            data-testid="manager-delete-modal-cancel"
            variant={BUTTON_VARIANT.ghost}
            color={BUTTON_COLOR.critical}
            {...handleClick(handleClose)}
            aria-label={t('deleteModalCancelButton')}
          >
            {t('deleteModalCancelButton')}
          </Button>
          <Button
            slot="actions"
            loading={isLoading}
            data-testid="manager-delete-modal-confirm"
            {...handleClick(() => {
              onConfirmDelete();
            })}
            color={BUTTON_COLOR.critical}
            aria-label={t('deleteModalDeleteButton')}
          >
            {t('deleteModalDeleteButton')}
          </Button>
        </footer>
      </section>
    </Modal>
  );
};
