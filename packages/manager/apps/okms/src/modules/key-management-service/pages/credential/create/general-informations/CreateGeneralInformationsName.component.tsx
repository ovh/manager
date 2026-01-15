import { CredentialNameErrorsType } from '@key-management-service/utils/credential/validateCredentialName';
import { useTranslation } from 'react-i18next';

import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { OdsFormField, OdsInput } from '@ovhcloud/ods-components/react';
import { Text } from '@ovhcloud/ods-react';

type CreateGeneralInformationsNameProps = {
  name: string | null;
  setName: (name: string | null) => void;
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
        return t('key_management_service_credential_update_name_error_required');
      case 'INVALID_CHARACTERS':
        return t('key_management_service_credential_update_name_error_invalid_characters');
      case 'TOO_MANY_CHARACTERS':
        return t('key_management_service_credential_update_name_error_max');

      default:
        return undefined;
    }
  };

  return (
    <OdsFormField error={getNameErrorMessage(credentialNameError)}>
      <div slot="label" className="mb-2 space-y-2">
        <Text className="block" preset="heading-5">
          {t('key_management_service_credential_create_general_information_display_name_title')}
        </Text>
        <Text preset="paragraph">
          {t('key_management_service_credential_create_general_information_display_name_subtitle')}
        </Text>
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
