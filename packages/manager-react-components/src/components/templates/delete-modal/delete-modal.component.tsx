import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  OsdsText,
  OsdsInput,
  OsdsMessage,
  OsdsSpinner,
  OsdsModal,
  OsdsButton,
  OsdsFormField,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_INPUT_TYPE,
  OdsInputValueChangeEvent,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
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
};

export const DeleteModal: React.FC<DeleteModalProps> = ({
  headline,
  description,
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
    <OsdsModal
      dismissible
      color={ODS_THEME_COLOR_INTENT.warning}
      headline={headline}
      onOdsModalClose={close}
    >
      {!!error && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          <OsdsText
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('deleteModalError', { error })}
          </OsdsText>
        </OsdsMessage>
      )}
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.body}
        className="block my-4"
      >
        {description}
      </OsdsText>
      <OsdsFormField className="mb-8">
        <div slot="label">
          <OsdsText
            className="block mb-3"
            color={ODS_THEME_COLOR_INTENT.text}
            level={ODS_TEXT_LEVEL.body}
            size={ODS_TEXT_SIZE._200}
          >
            {deleteInputLabel}
          </OsdsText>
        </div>
        <OsdsInput
          aria-label="delete-input"
          disabled={isLoading || undefined}
          type={ODS_INPUT_TYPE.text}
          value={deleteInput}
          onOdsValueChange={(e: OdsInputValueChangeEvent) =>
            setDeleteInput(e.detail.value)
          }
        />
      </OsdsFormField>
      {isLoading && (
        <div className="flex justify-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      )}
      <OsdsButton
        disabled={isLoading || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(close)}
      >
        {cancelButtonLabel || t('deleteModalCancelButton')}
      </OsdsButton>
      <OsdsButton
        disabled={isDisabled}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        {...handleClick(() => {
          setDeleteInput('');
          onConfirmDelete();
        })}
      >
        {confirmButtonLabel || t('deleteModalDeleteButton')}
      </OsdsButton>
    </OsdsModal>
  );
};
