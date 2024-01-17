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
} from '@ovhcloud/ods-components';
import { useShell } from '@ovh-ux/manager-react-core-application';
import { ApiError } from '@ovh-ux/manager-core-api';
import { handleClick } from '@/utils/ods-utils';
import { FormField } from './FormField';

export type VrackDeleteModalProps = {
  headline: string;
  description?: string;
  deleteInputLabel: string;
  isModalOpen?: boolean;
  closeModal: () => void;
  isLoading?: boolean;
  onConfirmDelete: () => void;
  error?: ApiError;
  onDisplayDataTracking?: string;
  cancelButtonDataTracking?: string;
  confirmButtonDataTracking?: string;
};

const terminateValue = 'TERMINATE';

export const VrackDeleteModal: React.FC<VrackDeleteModalProps> = ({
  headline,
  description,
  isModalOpen,
  deleteInputLabel,
  closeModal,
  isLoading,
  onConfirmDelete,
  error,
  onDisplayDataTracking,
  cancelButtonDataTracking,
  confirmButtonDataTracking,
}) => {
  const { t } = useTranslation('vrack-services');
  const [deleteInput, setDeleteInput] = React.useState('');
  const shell = useShell();
  const close = () => {
    setDeleteInput('');
    closeModal();
  };

  React.useEffect(() => {
    if (isModalOpen && onDisplayDataTracking) {
      shell.tracking.trackPage({
        name: onDisplayDataTracking,
        level2: '',
      });
    }
  }, [isModalOpen, onDisplayDataTracking]);

  return (
    <OsdsModal
      dismissible
      color={ODS_THEME_COLOR_INTENT.warning}
      headline={headline}
      masked={!isModalOpen || undefined}
      onOdsModalClose={close}
    >
      {!!error && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.error}>
          {t('genericApiError', {
            error,
            interpolation: { escapeValue: false },
          })}
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
        {...handleClick(close)}
        data-tracking={cancelButtonDataTracking}
      >
        {t('modalCancelButton')}
      </OsdsButton>
      <OsdsButton
        disabled={isLoading || deleteInput !== terminateValue || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        data-tracking={confirmButtonDataTracking}
        {...handleClick(() => {
          setDeleteInput('');
          onConfirmDelete();
        })}
      >
        {t('modalDeleteButton')}
      </OsdsButton>
    </OsdsModal>
  );
};
