import {
  ServiceKeyNameErrors,
  validateServiceKeyName,
} from '@key-management-service/utils/service-key/validateServiceKeyName';
import { useTranslation } from 'react-i18next';

import { ODS_INPUT_TYPE } from '@ovhcloud/ods-components';
import { OdsFormField, OdsInput } from '@ovhcloud/ods-components/react';
import { Text } from '@ovhcloud/ods-react';

type GeneralInformationSectionProps = {
  serviceKeyNameError: ServiceKeyNameErrors | undefined;
  setServiceKeyNameError: (error: ServiceKeyNameErrors | undefined) => void;
  keyDisplayName: string | undefined;
  setKeyDisplayName: (displayName: string) => void;
};

export const GeneralInformationSection = ({
  serviceKeyNameError,
  setServiceKeyNameError,
  keyDisplayName,
  setKeyDisplayName,
}: GeneralInformationSectionProps) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  const getErrorMessage = (error: ServiceKeyNameErrors | undefined) => {
    switch (error) {
      case 'REQUIRED':
        return t('key_management_service_service-keys_update_name_error_required');
      case 'INVALID_CHARACTERS':
        return t('key_management_service_service-keys_update_name_error_invalid_characters');
      case 'TOO_MANY_CHARACTERS':
        return t('key_management_service_service-keys_update_name_error_max');

      default:
        return undefined;
    }
  };

  return (
    <div className="flex flex-col space-y-3 md:space-y-4">
      <Text preset="heading-3">
        {t('key_management_service_service-keys_create_general_information_title')}
      </Text>

      <OdsFormField error={getErrorMessage(serviceKeyNameError)}>
        <div slot="label" className="mb-2 space-y-2">
          <Text className="block" preset="heading-5">
            {t('key_management_service_service-keys_create_general_information_field_name_title')}
          </Text>
          <Text preset="paragraph">
            {t(
              'key_management_service_service-keys_create_general_information_field_name_subtitle',
            )}
          </Text>
        </div>
        <OdsInput
          name="input-service-key-name"
          aria-label="input-service-key-name"
          type={ODS_INPUT_TYPE.text}
          hasError={!!serviceKeyNameError}
          isRequired
          placeholder={t(
            'key_management_service_service-keys_create_general_information_field_name_placeholder',
          )}
          value={keyDisplayName}
          onOdsChange={(e) => {
            const newServiceKeyName = e.detail.value?.toString() || '';
            if (keyDisplayName) {
              setServiceKeyNameError(validateServiceKeyName(newServiceKeyName));
            }
            setKeyDisplayName(newServiceKeyName);
          }}
        />
      </OdsFormField>
    </div>
  );
};
