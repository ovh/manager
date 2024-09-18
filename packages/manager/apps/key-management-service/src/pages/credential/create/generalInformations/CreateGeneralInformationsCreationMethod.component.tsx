import {
  CommonTitle,
  Description,
  Subtitle,
} from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_TYPOGRAPHY_SIZE,
  ODS_THEME_COLOR_INTENT,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_RADIO_BUTTON_SIZE,
  OdsTextAreaValueChangeEvent,
  OsdsTextareaCustomEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsRadio,
  OsdsRadioButton,
  OsdsRadioGroup,
  OsdsText,
  OsdsTextarea,
} from '@ovhcloud/ods-components/react';
import React, { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { CSR_PLACEHOLDER } from '../CreateGeneralInformations.constants';
import { CredentialCreationMethodErrorsType } from '@/utils/credential/validateCredentialCreationMethod';

type CreateGeneralInformationsCreationMethodProps = {
  csr: string | null;
  setCsr: Dispatch<SetStateAction<string | null>>;
  isCustomCsr: boolean;
  setIsCustomCsr: Dispatch<SetStateAction<boolean>>;
  credentialCreationMethodError: CredentialCreationMethodErrorsType | undefined;
};

const CreateGeneralInformationsCreationMethod = ({
  csr,
  setCsr,
  isCustomCsr,
  setIsCustomCsr,
  credentialCreationMethodError,
}: CreateGeneralInformationsCreationMethodProps) => {
  const { t } = useTranslation('key-management-service/credential');

  const getCreationMethodErrorMessage = (
    error: CredentialCreationMethodErrorsType,
  ) => {
    if (error === 'REQUIRED') {
      return t(
        'key_management_service_credential_update_custom_csr_error_required',
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col gap-5 md:gap-6">
      <Description>
        {t(
          'key_management_service_credential_create_general_information_creation_method_subtitle',
        )}
      </Description>
      <OsdsRadioGroup className="flex flex-col gap-6">
        <OsdsRadio checked={!isCustomCsr}>
          <OsdsRadioButton
            size={ODS_RADIO_BUTTON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => setIsCustomCsr(false)}
          >
            <span slot="end">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              >
                {t(
                  'key_management_service_credential_create_general_information_creation_method_no_key',
                )}
              </OsdsText>
              <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                {t(
                  `key_management_service_credential_create_general_information_creation_method_no_key_desc`,
                )}
              </OsdsText>
            </span>
          </OsdsRadioButton>
        </OsdsRadio>
        <OsdsRadio checked={isCustomCsr}>
          <OsdsRadioButton
            size={ODS_RADIO_BUTTON_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => setIsCustomCsr(true)}
          >
            <span slot="end">
              <OsdsText
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              >
                {t(
                  'key_management_service_credential_create_general_information_creation_method_key',
                )}
              </OsdsText>
              <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
                {t(
                  `key_management_service_credential_create_general_information_creation_method_key_desc`,
                )}
              </OsdsText>
            </span>
          </OsdsRadioButton>
        </OsdsRadio>
      </OsdsRadioGroup>
      {isCustomCsr && (
        <>
          <Subtitle>
            {t(
              'key_management_service_credential_create_general_information_csr_title',
            )}
          </Subtitle>
          <CommonTitle>
            {t(
              'key_management_service_credential_create_general_information_csr_subtitle',
            )}
          </CommonTitle>
          <OsdsFormField
            error={getCreationMethodErrorMessage(credentialCreationMethodError)}
          >
            <OsdsTextarea
              value={csr}
              error={!!credentialCreationMethodError || undefined}
              placeholder={CSR_PLACEHOLDER}
              onOdsValueChange={(
                e: OsdsTextareaCustomEvent<OdsTextAreaValueChangeEvent>,
              ) => {
                return setCsr(e.detail.value);
              }}
            ></OsdsTextarea>
          </OsdsFormField>
        </>
      )}
    </div>
  );
};

export default CreateGeneralInformationsCreationMethod;
