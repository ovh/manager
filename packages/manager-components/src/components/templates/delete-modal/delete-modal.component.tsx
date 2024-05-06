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
import { FormField } from '../../form/form-field/form-field.component';

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
};

const terminateValue = 'TERMINATE';

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
}) => {
  const { t } = useTranslation('delete-modal');
  const [deleteInput, setDeleteInput] = React.useState('');

  const close = () => {
    setDeleteInput('');
    closeModal();
  };

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
        className="block mb-3"
      >
        {description}
      </OsdsText>
      <FormField fullWidth label={deleteInputLabel}>
        <OsdsInput
          disabled={isLoading || undefined}
          type={ODS_INPUT_TYPE.text}
          value={deleteInput}
          onOdsValueChange={(e: OdsInputValueChangeEvent) =>
            setDeleteInput(e.detail.value)
          }
        />
      </FormField>
      {isLoading && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
      <OsdsButton
        disabled={isLoading || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        // {...handleClick(close)}
      >
        {cancelButtonLabel || t('deleteModalCancelButton')}
      </OsdsButton>
      <OsdsButton
        disabled={isLoading || deleteInput !== terminateValue || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        // {...handleClick(() => {
        //   setDeleteInput('');
        //   onConfirmDelete();
        // })}
      >
        {confirmButtonLabel || t('deleteModalDeleteButton')}
      </OsdsButton>
    </OsdsModal>
  );
};
