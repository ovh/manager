import React, { Dispatch, SetStateAction } from 'react';
import { ODS_INPUT_TYPE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { CredentialNameErrorsType } from '@/utils/credential/validateCredentialName';

type CreateGeneralInformationsNameProps = {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  credentialNameError: CredentialNameErrorsType | undefined;
};

const CreateGeneralInformationsName = ({
  name,
  setName,
  credentialNameError,
}: CreateGeneralInformationsNameProps) => {
  const { t } = useTranslation('key-management-service/credential');

  const getNameErrorMessage = (error: CredentialNameErrorsType | undefined) => {
    switch (error) {
      case 'REQUIRED':
        return t(
          'key_management_service_credential_update_name_error_required',
        );
      case 'INVALID_CHARACTERS':
        return t(
          'key_management_service_credential_update_name_error_invalid_characters',
        );
      case 'TOO_MANY_CHARACTERS':
        return t('key_management_service_credential_update_name_error_max');

      default:
        return undefined;
    }
  };

  return (
    <OdsFormField error={getNameErrorMessage(credentialNameError)}>
      <div slot="label" className="space-y-2 mb-2">
        <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
          {t(
            'key_management_service_credential_create_general_information_display_name_title',
          )}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(
            'key_management_service_credential_create_general_information_display_name_subtitle',
          )}
        </OdsText>
      </div>
      <OdsInput
        data-testid="input-name"
        name="name"
        aria-label="name"
        type={ODS_INPUT_TYPE.text}
        hasError={!!credentialNameError}
        isRequired
        placeholder={t(
          'key_management_service_credential_create_general_information_display_name_placeholder',
        )}
        value={name}
        onOdsChange={(e) => setName(e.detail.value as string)}
      />
    </OdsFormField>
  );
};

export default CreateGeneralInformationsName;
