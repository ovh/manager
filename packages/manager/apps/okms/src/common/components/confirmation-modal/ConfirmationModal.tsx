import React from 'react';
import {
  ODS_BUTTON_VARIANT,
  ODS_MODAL_COLOR,
  ODS_BUTTON_COLOR,
  ODS_TEXT_PRESET,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsModal,
  OdsText,
  OdsSpinner,
  OdsMessage,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

type ConfirmationModalProps = {
  title: string;
  message?: string;
  onDismiss: () => void;
  onConfirm?: () => void;
  type?: ODS_MODAL_COLOR;
  isLoading?: boolean;
  confirmButtonLabel?: string;
  isConfirmButtonLoading?: boolean;
  isConfirmButtonDisabled?: boolean;
  cancelButtonLabel?: string;
  error?: string;
};

export const ConfirmationModal = ({
  title,
  message,
  type = ODS_MODAL_COLOR.critical,
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
    <OdsModal
      data-testid="confirmation-modal"
      color={ODS_MODAL_COLOR[type]}
      className="text-left"
      onOdsClose={onDismiss}
      isDismissible
      isOpen={true}
    >
      <div className="space-y-4">
        {error && (
          <OdsMessage
            color="danger"
            isDismissible={false}
            className="w-full"
            data-testid="confirmation-modal-error-message"
          >
            {error}
          </OdsMessage>
        )}
        <OdsText preset={ODS_TEXT_PRESET.heading4}>{title}</OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>{message}</OdsText>

        {isLoading && (
          <div data-testid="spinner" className="flex justify-center my-5">
            <OdsSpinner size={ODS_SPINNER_SIZE.md} inline-block></OdsSpinner>
          </div>
        )}
        {!isLoading && (
          <div className="flex justify-end gap-2">
            <OdsButton
              data-testid={'cancel-button-test-id'}
              color={ODS_BUTTON_COLOR.critical}
              onClick={onDismiss}
              variant={ODS_BUTTON_VARIANT.ghost}
              label={cancelButtonLabel || t('cancel')}
              type="button"
            />

            <OdsButton
              data-testid={'confirm-button-test-id'}
              color={ODS_BUTTON_COLOR.critical}
              onClick={onConfirm}
              isDisabled={isConfirmButtonDisabled}
              isLoading={isConfirmButtonLoading}
              variant={ODS_BUTTON_VARIANT.default}
              label={confirmButtonLabel || t('confirm')}
              type="button"
            />
          </div>
        )}
      </div>
    </OdsModal>
  );
};
