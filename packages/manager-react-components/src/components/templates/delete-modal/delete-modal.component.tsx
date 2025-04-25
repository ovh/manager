import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsText,
  OdsInput,
  OdsMessage,
  OdsModal,
  OdsButton,
  OdsFormField,
} from '@ovhcloud/ods-components/react';
import {
  OdsInputCustomEvent,
  OdsInputChangeEventDetail,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_BUTTON_COLOR,
  ODS_MESSAGE_COLOR,
  ODS_MODAL_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { handleClick } from '../../../utils/click-utils';
import './translations/translations';

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
      onOdsClose={close}
      isOpen={isOpen}
    >
      <div className="flex flex-col gap-4">
        <OdsText preset={ODS_TEXT_PRESET.heading3}>{headline}</OdsText>
        {!!error && (
          <OdsMessage color={ODS_MESSAGE_COLOR.warning}>
            {t('deleteModalError', { error })}
          </OdsMessage>
        )}
        {description && (
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>{description}</OdsText>
        )}
        <OdsFormField>
          <label htmlFor="delete-input" slot="label">
            {deleteInputLabel}
          </label>
          <OdsInput
            className="block"
            id="delete-input"
            name="delete-input"
            aria-label="delete-input"
            isDisabled={isLoading || undefined}
            type={ODS_INPUT_TYPE.text}
            value={deleteInput}
            onOdsChange={(e: OdsInputCustomEvent<OdsInputChangeEventDetail>) =>
              setDeleteInput(e.detail.value as string)
            }
          />
        </OdsFormField>
        <div className="flex justify-end gap-2">
          <OdsButton
            slot="actions"
            data-testid="manager-delete-modal-cancel"
            variant={ODS_BUTTON_VARIANT.ghost}
            color={ODS_BUTTON_COLOR.primary}
            {...handleClick(close)}
            label={cancelButtonLabel || t('deleteModalCancelButton')}
          />
          <OdsButton
            isDisabled={isDisabled}
            slot="actions"
            isLoading={isLoading}
            data-testid="manager-delete-modal-confirm"
            {...handleClick(() => {
              setDeleteInput('');
              onConfirmDelete();
            })}
            label={confirmButtonLabel || t('deleteModalDeleteButton')}
          />
        </div>
      </div>
    </OdsModal>
  );
};
