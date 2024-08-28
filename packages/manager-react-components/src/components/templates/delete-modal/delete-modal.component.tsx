import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsText,
  OdsInput,
  OdsMessage,
  OdsSpinner,
  OdsModal,
  OdsButton,
  OdsFormField,
} from '@ovhcloud/ods-components/react';
import {
  OdsInputCustomEvent,
  OdsInputChangeEventDetail,
  ODS_TEXT_PRESET,
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_INPUT_TYPE,
  ODS_BUTTON_COLOR,
  ODS_MESSAGE_COLOR,
  ODS_MODAL_COLOR,
} from '@ovhcloud/ods-components';
import { handleClick } from '../../../utils/click-utils';
import './translations/translations';
import './delete-modal.scss';

export const defaultDeleteModalTerminateValue = 'TERMINATE';

export type DeleteModalProps = {
  headline: string;
  description?: string;
  deleteInputLabel: string;
  closeModal: () => void;
  isLoading?: boolean;
  onConfirmDelete: () => void;
  error?: string;
  cancelButtonLabel?: string;
  confirmButtonLabel?: string;
  terminateValue?: string;
  isOpen?: boolean;
};

export const DeleteModal: React.FC<DeleteModalProps> = ({
  headline,
  description,
  isOpen = false,
  deleteInputLabel,
  closeModal,
  isLoading,
  onConfirmDelete,
  error,
  cancelButtonLabel,
  confirmButtonLabel,
  terminateValue = defaultDeleteModalTerminateValue,
}) => {
  const { t } = useTranslation('delete-modal');
  const [deleteInput, setDeleteInput] = React.useState('');
  const isDisabled = isLoading || deleteInput !== terminateValue || undefined;

  const close = React.useCallback(() => {
    setDeleteInput('');
    closeModal();
  }, []);

  return (
    <OdsModal
      color={ODS_MODAL_COLOR.warning}
      class="modal-actions"
      onOdsClose={close}
      isOpen={isOpen}
    >
      <div>
        <OdsText
          className="delete-modal-headline"
          preset={ODS_TEXT_PRESET.heading6}
        >
          {headline}
        </OdsText>
      </div>
      {!!error && (
        <OdsMessage color={ODS_MESSAGE_COLOR.warning}>
          <OdsText>{t('deleteModalError', { error })}</OdsText>
        </OdsMessage>
      )}
      <OdsText className="delete-modal-description">{description}</OdsText>
      <OdsFormField className="mb-8">
        <div slot="label">
          <OdsText className="delete-modal-input-label">
            <b>{deleteInputLabel}</b>
          </OdsText>
        </div>
        <OdsInput
          name=""
          aria-label="delete-input"
          isDisabled={isLoading || undefined}
          type={ODS_INPUT_TYPE.text}
          value={deleteInput}
          onOdsChange={(e: OdsInputCustomEvent<OdsInputChangeEventDetail>) =>
            setDeleteInput(e.detail.value as string)
          }
        />
      </OdsFormField>
      {isLoading && (
        <div className="flex justify-center">
          <OdsSpinner size={ODS_SPINNER_SIZE.md} />
        </div>
      )}
      <OdsButton
        isDisabled={isLoading}
        slot="actions"
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_BUTTON_COLOR.primary}
        {...handleClick(close)}
        label={cancelButtonLabel || t('deleteModalCancelButton')}
      />
      <OdsButton
        isDisabled={isDisabled}
        slot="actions"
        {...handleClick(() => {
          setDeleteInput('');
          onConfirmDelete();
        })}
        label={confirmButtonLabel || t('deleteModalDeleteButton')}
      />
    </OdsModal>
  );
};
