import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  ODS_BUTTON_TYPE,
  ODS_BUTTON_VARIANT,
  ODS_INPUT_TYPE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  OdsInputValueChangeEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsInput,
  OsdsModal,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { terminateValue } from './TerminateModal.constants';

export type TerminateModalProps = {
  closeModal: () => void;
  isLoading?: boolean;
  onConfirmTerminate: () => void;
};

export const TerminateModal: React.FC<TerminateModalProps> = ({
  closeModal,
  isLoading,
  onConfirmTerminate,
}) => {
  const { trackClick } = useOvhTracking();
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
      headline={t('key_management_service_terminate_heading')}
      onOdsModalClose={close}
    >
      <div className="mt-8">
        {isLoading ? (
          <div className="flex justify-center">
            <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
          </div>
        ) : (
          <>
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              className="block mb-3"
            >
              {t('key_management_service_terminate_description', {
                terminateKeyword: terminateValue,
              })}
            </OsdsText>
            <OsdsInput
              disabled={isLoading || undefined}
              type={ODS_INPUT_TYPE.text}
              value={terminateInput}
              onOdsValueChange={(e: OdsInputValueChangeEvent) =>
                setTerminateInput(e.detail.value)
              }
            />
          </>
        )}
      </div>
      <OsdsButton
        disabled={isLoading || undefined}
        slot="actions"
        type={ODS_BUTTON_TYPE.button}
        variant={ODS_BUTTON_VARIANT.ghost}
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actionType: 'navigation',
            actions: ['delete_kms', 'cancel'],
          });
          close();
        }}
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
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actionType: 'navigation',
            actions: ['delete_kms', 'confirm'],
          });
          setTerminateInput('');
          onConfirmTerminate();
        }}
      >
        {t('key_management_service_terminate_confirm')}
      </OsdsButton>
    </OsdsModal>
  );
};
