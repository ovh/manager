import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsText,
  OdsMessage,
  OdsModal,
  OdsButton,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_COLOR,
  ODS_MESSAGE_COLOR,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { handleClick } from '../../../utils/click-utils';
import './translations/translations';

export const defaultDeleteModalTerminateValue = 'TERMINATE';

export type DeleteModalProps = {
  /**
   * @deprecated use serviceTypeName instead. Headline of modal will have a fixed text
   */
  headline?: string;
  // serviceType: enum;
  serviceTypeName?: string;
  /**
   * Description of modal will have a fixed text
   * @deprecated use children instead
   */
  description?: string;
  /**
   * @deprecated input field has been removed
   */
  deleteInputLabel?: string;
  closeModal: () => void;
  isLoading?: boolean;
  onConfirmDelete: () => void;
  error?: string;
  /**
   * @deprecated the button label is now fixed
   */
  cancelButtonLabel?: string;
  /**
   * @deprecated the button label is now fixed
   */
  confirmButtonLabel?: string;
  children?: React.ReactNode;
  /**
   * @deprecated input field has been removed
   */
  terminateValue?: string;
  isOpen?: boolean;
};

export const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen = false,
  serviceTypeName,
  closeModal,
  isLoading,
  onConfirmDelete,
  error,
  children,
}) => {
  const { t } = useTranslation('delete-modal');

  const close = React.useCallback(() => {
    closeModal();
  }, []);

  return (
    <OdsModal
      color={ODS_MODAL_COLOR.critical}
      onOdsClose={close}
      isOpen={isOpen}
    >
      <div className="flex flex-col gap-4">
        <OdsText preset={ODS_TEXT_PRESET.heading3}>
          {t('deleteModalHeadline', {
            serviceType: serviceTypeName || t('deleteModalHeadlineService'),
          })}
        </OdsText>
        {!!error && (
          <OdsMessage color={ODS_MESSAGE_COLOR.warning}>
            {t('deleteModalError', { error })}
          </OdsMessage>
        )}
        <OdsText
          preset={ODS_TEXT_PRESET.paragraph}
          data-testid="manager-delete-modal-description"
        >
          {t('deleteModalDescription')}
        </OdsText>
        {children}
        <div className="flex justify-end gap-2">
          <OdsButton
            slot="actions"
            data-testid="manager-delete-modal-cancel"
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_BUTTON_COLOR.critical}
            {...handleClick(close)}
            label={t('deleteModalCancelButton')}
          />
          <OdsButton
            slot="actions"
            isLoading={isLoading}
            data-testid="manager-delete-modal-confirm"
            {...handleClick(() => {
              onConfirmDelete();
            })}
            color={ODS_BUTTON_COLOR.critical}
            label={t('deleteModalDeleteButton')}
          />
        </div>
      </div>
    </OdsModal>
  );
};
