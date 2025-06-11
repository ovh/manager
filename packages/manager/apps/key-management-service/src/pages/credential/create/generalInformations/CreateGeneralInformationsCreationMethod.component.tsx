import React, { Dispatch, SetStateAction } from 'react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsText,
  OdsFormField,
  OdsRadio,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';
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
  const { trackClick } = useOvhTracking();

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
    <>
      <OdsFormField>
        <div slot="label" className="space-y-2 mb-2">
          <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
            {t(
              'key_management_service_credential_create_general_creation_method_title',
            )}
          </OdsText>
          <OdsText preset={ODS_TEXT_PRESET.paragraph}>
            {t(
              'key_management_service_credential_create_general_information_creation_method_subtitle',
            )}
          </OdsText>
        </div>
        <div className="flex items-center gap-3">
          <OdsRadio
            name="method"
            inputId="radio-method-no-key"
            data-testid="radio-method-no-key"
            isChecked={!isCustomCsr}
            onClick={() => {
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['select_type_key', 'ovh_generated'],
              });
              setIsCustomCsr(false);
            }}
          />
          <label htmlFor="radio-method-no-key">
            <OdsText className="block" preset={ODS_TEXT_PRESET.paragraph}>
              {t(
                'key_management_service_credential_create_general_information_creation_method_no_key',
              )}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.caption}>
              {t(
                `key_management_service_credential_create_general_information_creation_method_no_key_desc`,
              )}
            </OdsText>
          </label>
        </div>
        <div className="flex items-center gap-3">
          <OdsRadio
            name="method"
            inputId="radio-method-key"
            data-testid="radio-method-key"
            isChecked={isCustomCsr}
            onClick={() => {
              trackClick({
                location: PageLocation.funnel,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: ['select_type_key', 'custom'],
              });
              setIsCustomCsr(true);
            }}
          />
          <label htmlFor="radio-method-key">
            <OdsText className="block" preset={ODS_TEXT_PRESET.paragraph}>
              {t(
                'key_management_service_credential_create_general_information_creation_method_key',
              )}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.caption}>
              {t(
                `key_management_service_credential_create_general_information_creation_method_key_desc`,
              )}
            </OdsText>
          </label>
        </div>
      </OdsFormField>
      {isCustomCsr && (
        <OdsFormField
          error={getCreationMethodErrorMessage(credentialCreationMethodError)}
        >
          <div slot="label" className="space-y-2 mb-2">
            <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
              {t(
                'key_management_service_credential_create_general_information_csr_title',
              )}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t(
                'key_management_service_credential_create_general_information_csr_subtitle',
              )}
            </OdsText>
          </div>
          <OdsTextarea
            name="credentialCreationMethod"
            value={csr}
            hasError={!!credentialCreationMethodError}
            placeholder={CSR_PLACEHOLDER}
            rows={10}
            onOdsChange={(e) => setCsr(e.detail.value)}
          />
        </OdsFormField>
      )}
    </>
  );
};

export default CreateGeneralInformationsCreationMethod;
