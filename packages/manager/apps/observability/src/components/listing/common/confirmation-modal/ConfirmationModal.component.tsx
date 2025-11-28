import React from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  BUTTON_COLOR,
  BUTTON_VARIANT,
  Button,
  MODAL_COLOR,
  Message,
  Modal,
  SPINNER_SIZE,
  Spinner,
  TEXT_PRESET,
  Text,
} from '@ovh-ux/muk';

import { ConfirmationModalProps } from './ConfirmationModal.props';

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
            {error}
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
              color={BUTTON_COLOR.critical}
              onClick={onDismiss}
              variant={BUTTON_VARIANT.ghost}
              type="button"
            >
              {cancelButtonLabel || t('cancel')}
            </Button>

            <Button
              data-testid={'confirm-button-test-id'}
              color={BUTTON_COLOR.critical}
              onClick={onConfirm}
              disabled={isConfirmButtonDisabled || isConfirmButtonLoading}
              loading={isConfirmButtonLoading}
              variant={BUTTON_VARIANT.default}
              type="button"
            >
              {confirmButtonLabel || t('confirm')}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
};
