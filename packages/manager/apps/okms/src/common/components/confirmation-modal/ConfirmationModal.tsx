import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR, ODS_SPINNER_SIZE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsMessage, OdsModal, OdsSpinner, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button } from '@ovh-ux/muk';

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
          <div data-testid="spinner" className="my-5 flex justify-center">
            <OdsSpinner size={ODS_SPINNER_SIZE.md} inline-block></OdsSpinner>
          </div>
        )}
        {!isLoading && (
          <div className="flex justify-end gap-2">
            <Button
              data-testid={'cancel-button-test-id'}
              color="critical"
              onClick={onDismiss}
              variant="ghost"
              type="button"
            >
              {cancelButtonLabel || t('cancel')}
            </Button>

            <Button
              data-testid={'confirm-button-test-id'}
              color="critical"
              onClick={onConfirm}
              disabled={isConfirmButtonDisabled}
              loading={isConfirmButtonLoading}
              variant="default"
              type="button"
            >
              {confirmButtonLabel || t('confirm')}
            </Button>
          </div>
        )}
      </div>
    </OdsModal>
  );
};
