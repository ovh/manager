import { ApiError } from '@ovh-ux/manager-core-api';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsInput,
  OsdsMessage,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { terminateValue } from './TerminateModal.constants';

export type TerminateModalProps = {
  headline: string;
  description?: string;
  terminateInputButton: string;
  closeModal: () => void;
  isLoading?: boolean;
  onConfirmTerminate: () => void;
  error?: ApiError;
};

export const TerminateModal: React.FC<TerminateModalProps> = ({
  headline,
  description,
  terminateInputButton,
  closeModal,
  isLoading,
  onConfirmTerminate,
  error,
}) => {
  const { t } = useTranslation('key-management-service/terminate');
  const [terminateInput, setTerminateInput] = useState('');

  const close = () => {
    setTerminateInput('');
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
            {t('key_management_service_terminate_error', {
              error: error.response?.data?.message,
            })}
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
      <OsdsInput
        disabled={isLoading || undefined}
        type={ODS_INPUT_TYPE.text}
        value={terminateInput}
        onOdsValueChange={(e: OdsInputValueChangeEvent) =>
          setTerminateInput(e.detail.value)
        }
      />
      {isLoading && <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />}
      <OsdsButton
        disabled={isLoading || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={close}
      >
        {t('key_management_service_terminate_cancel')}
      </OsdsButton>
      <OsdsButton
        disabled={isLoading || terminateInput !== terminateValue || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          setTerminateInput('');
          onConfirmTerminate();
        }}
      >
        {terminateInputButton}
      </OsdsButton>
    </OsdsModal>
  );
};
