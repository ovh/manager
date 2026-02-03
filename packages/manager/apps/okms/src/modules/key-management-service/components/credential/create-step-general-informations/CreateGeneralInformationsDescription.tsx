import {
  CredentialDescriptionErrorsType,
  CredentialDescriptionMaxCharacters,
} from '@key-management-service/utils/credential/validateCredentialDescription';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldHelper,
  FormFieldLabel,
  Text,
  Textarea,
} from '@ovhcloud/ods-react';

type CreateGeneralInformationsDescriptionProps = {
  description: string | null;
  setDescription: (description: string | null) => void;
  credentialDescriptionError: CredentialDescriptionErrorsType | undefined;
};

export const CreateGeneralInformationsDescription = ({
  description = '',
  setDescription,
  credentialDescriptionError,
}: CreateGeneralInformationsDescriptionProps) => {
  const { t } = useTranslation('key-management-service/credential');

  const getDescriptionErrorMessage = (error: CredentialDescriptionErrorsType | undefined) => {
    switch (error) {
      case 'INVALID_CHARACTERS':
        return t('key_management_service_credential_update_description_error_invalid_characters');
      case 'TOO_MANY_CHARACTERS':
        return t('key_management_service_credential_update_description_error_max');
      default:
        return undefined;
    }
  };

  const errorMessage = getDescriptionErrorMessage(credentialDescriptionError);

  return (
    <FormField invalid={!!credentialDescriptionError} className="mb-4">
      <FormFieldLabel>
        <Text preset="heading-5" className="mb-2">
          {t('key_management_service_credential_create_general_information_description_title')}
        </Text>
      </FormFieldLabel>
      <Textarea
        name="description"
        aria-label="description"
        data-testid="input-description"
        value={description || undefined}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
      />
      <FormFieldHelper>
        <Text preset="caption">
          {description?.length || 0}/{CredentialDescriptionMaxCharacters}
        </Text>
      </FormFieldHelper>
      {errorMessage && <FormFieldError>{errorMessage}</FormFieldError>}
    </FormField>
  );
};
