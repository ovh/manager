import React from 'react';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Button,
  MODAL_COLOR,
  Message,
  SPINNER_SIZE,
  Spinner,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/muk';

import ErrorMessage from '@/components/error/ErrorMessage.component';
import { ConfirmationModalProps } from '@/components/listing/common/confirmation-modal/ConfirmationModal.props';

export const ConfirmationModal = ({
  title,
  message,
  type = MODAL_COLOR.critical,
  onDismiss,
  isLoading,
  confirmButtonLabel,
  isConfirmButtonLoading,
  isConfirmButtonDisabled,
  onConfirm,
  cancelButtonLabel,
  error,
}: ConfirmationModalProps) => {
  const { t } = useTranslation(NAMESPACES.ACTIONS);

  return (
    <Modal data-testid="confirmation-modal" type={type} onOpenChange={onDismiss} open={true}>
      <div className="space-y-4">
        {error && (
          <Message
            color="critical"
            dismissible={false}
            className="w-full"
            data-testid="confirmation-modal-error-message"
          >
            <ErrorMessage error={error} />
          </Message>
        )}

        <Text preset={TEXT_PRESET.heading4}>{title}</Text>
        <Text preset={TEXT_PRESET.paragraph}>{message}</Text>

        {isLoading && (
          <div data-testid="spinner" className="my-5 flex justify-center">
            <Spinner size={SPINNER_SIZE.md} inline-block></Spinner>
          </div>
        )}

        {!isLoading && (
          <div className="flex justify-end gap-2">
            <Button
              data-testid={'cancel-button-test-id'}
              color={BUTTON_COLOR.primary}
              onClick={onDismiss}
              variant={BUTTON_VARIANT.ghost}
            >
              {cancelButtonLabel || t('cancel')}
            </Button>

            <Button
              data-testid={'confirm-button-test-id'}
              color={type === MODAL_COLOR.critical ? BUTTON_COLOR.critical : BUTTON_COLOR.primary}
              onClick={onConfirm}
              disabled={isConfirmButtonDisabled || isConfirmButtonLoading}
              loading={isConfirmButtonLoading}
              variant={BUTTON_VARIANT.default}
            >
              {confirmButtonLabel || t('confirm')}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
