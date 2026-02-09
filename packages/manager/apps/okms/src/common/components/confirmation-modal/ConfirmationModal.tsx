import { useTranslation } from 'react-i18next';

import {
  Message,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOpenChangeDetail,
  Spinner,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Button } from '@ovh-ux/muk';

type ConfirmationModalProps = {
  title: string;
  message?: string;
  onDismiss: () => void;
  onConfirm?: () => void;
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

  const handleClose = (detail: ModalOpenChangeDetail) => {
    if (!detail.open) {
      onDismiss?.();
    }
  };

  return (
    <Modal data-testid="confirmation-modal" onOpenChange={handleClose} open>
      <ModalContent dismissible data-testid="confirmation-modal">
        <ModalHeader>
          <Text preset="heading-4">{title}</Text>
        </ModalHeader>
        <ModalBody className="space-y-4">
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

          {isLoading && (
            <div data-testid="spinner" className="my-5 flex justify-center">
              <Spinner />
            </div>
          )}
          {!isLoading && (
            <>
              <Text preset="paragraph">{message}</Text>
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
                >
                  {confirmButtonLabel || t('confirm')}
                </Button>
              </div>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};
