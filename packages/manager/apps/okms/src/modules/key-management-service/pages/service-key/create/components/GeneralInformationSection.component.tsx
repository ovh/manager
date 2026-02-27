import { ChangeEvent } from 'react';

import {
  ServiceKeyNameErrors,
  validateServiceKeyName,
} from '@key-management-service/utils/service-key/validateServiceKeyName';
import { useTranslation } from 'react-i18next';

import { FormField, FormFieldError, FormFieldLabel, Input, Text } from '@ovhcloud/ods-react';

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

  const errorMessages: Record<ServiceKeyNameErrors, string> = {
    REQUIRED: t('key_management_service_service-keys_update_name_error_required'),
    INVALID_CHARACTERS: t(
      'key_management_service_service-keys_update_name_error_invalid_characters',
    ),
    TOO_MANY_CHARACTERS: t('key_management_service_service-keys_update_name_error_max'),
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newServiceKeyName = e.target.value || '';
    if (keyDisplayName) {
      setServiceKeyNameError(validateServiceKeyName(newServiceKeyName));
    }
    setKeyDisplayName(newServiceKeyName);
  };

  return (
    <div className="flex flex-col space-y-3 md:space-y-4">
      <Text preset="heading-3">
        {t('key_management_service_service-keys_create_general_information_title')}
      </Text>

      <FormField invalid={!!serviceKeyNameError}>
        <FormFieldLabel>
          <div className="mb-2 space-y-2">
            <Text className="block" preset="heading-5">
              {t('key_management_service_service-keys_create_general_information_field_name_title')}
            </Text>
            <Text preset="paragraph">
              {t(
                'key_management_service_service-keys_create_general_information_field_name_subtitle',
              )}
            </Text>
          </div>
        </FormFieldLabel>
        <Input
          invalid={!!serviceKeyNameError}
          required
          placeholder={t(
            'key_management_service_service-keys_create_general_information_field_name_placeholder',
          )}
          value={keyDisplayName || ''}
          onChange={handleChange}
        />
        {serviceKeyNameError && (
          <FormFieldError>{errorMessages[serviceKeyNameError]}</FormFieldError>
        )}
      </FormField>
    </div>
  );
};
