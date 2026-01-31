import {
  CredentialDescriptionErrorsType,
  CredentialDescriptionMaxCharacters,
} from '@key-management-service/utils/credential/validateCredentialDescription';
import { useTranslation } from 'react-i18next';

import { OdsFormField, OdsTextarea } from '@ovhcloud/ods-components/react';
import { Text } from '@ovhcloud/ods-react';

type CreateGeneralInformationsDescriptionProps = {
  description: string | null;
  setDescription: (description: string | null) => void;
  credentialDescriptionError: CredentialDescriptionErrorsType | undefined;
};

const CreateGeneralInformationsDescription = ({
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

  return (
    <OdsFormField error={getDescriptionErrorMessage(credentialDescriptionError)}>
      <Text slot="label" preset="heading-5" className="mb-2">
        {t('key_management_service_credential_create_general_information_description_title')}
      </Text>
      <OdsTextarea
        name="description"
        aria-label="description"
        data-testid="input-description"
        value={description}
        hasError={!!credentialDescriptionError}
        onOdsChange={(e) => setDescription(e.detail.value)}
        rows={4}
      />
      <Text slot="visual-hint" preset="caption">
        {description?.length || 0}/{CredentialDescriptionMaxCharacters}
      </Text>
    </OdsFormField>
  );
};

export default CreateGeneralInformationsDescription;
