import React, { Dispatch, SetStateAction } from 'react';
import {
  OdsFormField,
  OdsText,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  CredentialDescriptionErrorsType,
  CredentialDescriptionMaxCharacters,
} from '@/utils/credential/validateCredentialDescription';

type CreateGeneralInformationsDescriptionProps = {
  description: string | null;
  setDescription: Dispatch<SetStateAction<string | null>>;
  credentialDescriptionError: CredentialDescriptionErrorsType | undefined;
};

const CreateGeneralInformationsDescription = ({
  description = '',
  setDescription,
  credentialDescriptionError,
}: CreateGeneralInformationsDescriptionProps) => {
  const { t } = useTranslation('key-management-service/credential');

  const getDescriptionErrorMessage = (
    error: CredentialDescriptionErrorsType | undefined,
  ) => {
    switch (error) {
      case 'INVALID_CHARACTERS':
        return t(
          'key_management_service_credential_update_description_error_invalid_characters',
        );
      case 'TOO_MANY_CHARACTERS':
        return t(
          'key_management_service_credential_update_description_error_max',
        );
      default:
        return undefined;
    }
  };

  return (
    <OdsFormField
      error={getDescriptionErrorMessage(credentialDescriptionError)}
    >
      <OdsText slot="label" preset={ODS_TEXT_PRESET.heading5} className="mb-2">
        {t(
          'key_management_service_credential_create_general_information_description_title',
        )}
      </OdsText>
      <OdsTextarea
        name="description"
        aria-label="description"
        data-testid="input-description"
        value={description}
        hasError={!!credentialDescriptionError}
        onOdsChange={(e) => setDescription(e.detail.value)}
        rows={4}
      />
      <OdsText slot="visual-hint" preset={ODS_TEXT_PRESET.caption}>
        {description?.length || 0}/{CredentialDescriptionMaxCharacters}
      </OdsText>
    </OdsFormField>
  );
};

export default CreateGeneralInformationsDescription;
