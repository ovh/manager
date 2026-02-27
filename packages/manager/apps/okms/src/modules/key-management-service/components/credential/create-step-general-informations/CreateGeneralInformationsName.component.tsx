import { CredentialNameErrorsType } from '@key-management-service/utils/credential/validateCredentialName';
import { useTranslation } from 'react-i18next';

import {
  FormField,
  FormFieldError,
  FormFieldLabel,
  INPUT_TYPE,
  Input,
  Text,
} from '@ovhcloud/ods-react';

type CreateGeneralInformationsNameProps = {
  name: string | null;
  setName: (name: string | null) => void;
  credentialNameError: CredentialNameErrorsType | undefined;
};

export const CreateGeneralInformationsName = ({
  name,
  setName,
  credentialNameError,
}: CreateGeneralInformationsNameProps) => {
  const { t } = useTranslation('key-management-service/credential');

  const getNameErrorMessage = (error: CredentialNameErrorsType | undefined) => {
    switch (error) {
      case 'REQUIRED':
        return t('key_management_service_credential_update_name_error_required');
      case 'INVALID_CHARACTERS':
        return t('key_management_service_credential_update_name_error_invalid_characters');
      case 'TOO_MANY_CHARACTERS':
        return t('key_management_service_credential_update_name_error_max');

      default:
        return undefined;
    }
  };

  const errorMessage = getNameErrorMessage(credentialNameError);

  return (
    <FormField invalid={!!credentialNameError}>
      <FormFieldLabel>
        <div className="mb-2 space-y-2">
          <Text className="block" preset="heading-5">
            {t('key_management_service_credential_create_general_information_display_name_title')}
          </Text>
          <Text preset="paragraph">
            {t(
              'key_management_service_credential_create_general_information_display_name_subtitle',
            )}
          </Text>
        </div>
      </FormFieldLabel>
      <Input
        data-testid="input-name"
        name="name"
        aria-label="name"
        type={INPUT_TYPE.text}
        invalid={!!credentialNameError}
        required
        placeholder={t(
          'key_management_service_credential_create_general_information_display_name_placeholder',
        )}
        value={name || ''}
        onChange={(e) => setName(e.target.value || null)}
      />
      {errorMessage && <FormFieldError>{errorMessage}</FormFieldError>}
    </FormField>
  );
};
