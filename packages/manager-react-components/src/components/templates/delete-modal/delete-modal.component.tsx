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
      class="modal-actions"
      onOdsClose={close}
      isOpen={isOpen}
    >
      <div>
        <span className="delete-modal-headline text-[--ods-color-heading] text-[24px] leading-[32px] font-bold">
          {headline}
        </span>
      </div>
      {!!error && (
        <OdsMessage color={ODS_MESSAGE_COLOR.warning}>
          <OdsText preset="span">{t('deleteModalError', { error })}</OdsText>
        </OdsMessage>
      )}
      <span className="delete-modal-description text-[--ods-color-text] text-[14px] leading-[18px] my-[8px]">
        {description}
      </span>
      <OdsFormField className="mb-8">
        <label slot="label">{deleteInputLabel}</label>
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
      <OdsButton
        isDisabled={isLoading}
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
    </OdsModal>
  );
};
