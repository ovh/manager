import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { OsdsCheckboxButton, OsdsText } from '@ovhcloud/ods-components/react';
import { useServiceKeyOperationsTranslations } from '@/hooks/serviceKey/useServiceKeyOperationsTranslations';
import { OkmsServiceKeyReferenceOperations } from '@/types/okmsServiceKeyReference.type';

type TServiceKeyOperationCheckbox = {
  operation: OkmsServiceKeyReferenceOperations;
};

export const ServiceKeyOperationCheckbox = ({
  operation,
}: TServiceKeyOperationCheckbox) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const translatedOperations = useServiceKeyOperationsTranslations(
    operation.value,
  );

  return (
    <OsdsCheckboxButton color={ODS_THEME_COLOR_INTENT.primary}>
      <span slot="end">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        >
          {translatedOperations.join(' / ')}
        </OsdsText>
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t(
            `key_management_service_service-keys_create_crypto_field_usage_description_${operation.value.join(
              '_',
            )}`,
          )}
        </OsdsText>
      </span>
    </OsdsCheckboxButton>
  );
};
