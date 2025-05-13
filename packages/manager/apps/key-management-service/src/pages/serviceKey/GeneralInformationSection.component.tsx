import React from 'react';
import { Subtitle } from '@ovh-ux/manager-react-components';
import { ODS_INPUT_TYPE, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsFormField,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ServiceKeyNameErrorsType,
  validateServiceKeyName,
} from '@/utils/serviceKey/validateServiceKeyName';

export type GeneralInformationSectionProps = {
  serviceKeyNameError?: ServiceKeyNameErrorsType;
  setServiceKeyNameError?: React.Dispatch<
    React.SetStateAction<ServiceKeyNameErrorsType>
  >;
  keyDisplayName: string;
  setKeyDisplayName: React.Dispatch<React.SetStateAction<string>>;
};

export const GeneralInformationSection: React.FC<GeneralInformationSectionProps> = ({
  serviceKeyNameError,
  setServiceKeyNameError,
  keyDisplayName,
  setKeyDisplayName,
}) => {
  const { t } = useTranslation('key-management-service/serviceKeys');

  const getErrorMessage = (error: ServiceKeyNameErrorsType) => {
    switch (error) {
      case 'REQUIRED':
        return t(
          'key_management_service_service-keys_update_name_error_required',
        );
      case 'INVALID_CHARACTERS':
        return t(
          'key_management_service_service-keys_update_name_error_invalid_characters',
        );
      case 'TOO_MANY_CHARACTERS':
        return t('key_management_service_service-keys_update_name_error_max');

      default:
        return null;
    }
  };

  return (
    <div className="grid gap-6 md:gap-8">
      <Subtitle>
        {t(
          'key_management_service_service-keys_create_general_information_title',
        )}
      </Subtitle>
      <div className="grid gap-5 md:gap-6">
        <OdsFormField error={getErrorMessage(serviceKeyNameError)}>
          <div slot="label">
            <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
              {t(
                'key_management_service_service-keys_create_general_information_field_name_title',
              )}
            </OdsText>
            <OdsText preset={ODS_TEXT_PRESET.paragraph}>
              {t(
                'key_management_service_service-keys_create_general_information_field_name_subtitle',
              )}
            </OdsText>
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
              const newServiceKeyName = e.detail.value as string;
              setServiceKeyNameError(validateServiceKeyName(newServiceKeyName));
              setKeyDisplayName(newServiceKeyName);
            }}
          />
        </OdsFormField>
      </div>
    </div>
  );
};
