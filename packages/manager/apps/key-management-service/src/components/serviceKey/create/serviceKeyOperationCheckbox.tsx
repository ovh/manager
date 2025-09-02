import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_TEXT_PRESET,
  OdsCheckboxCustomEvent,
  OdsCheckboxChangeEventDetail,
  OdsCheckbox as OdsCheckboxType,
} from '@ovhcloud/ods-components';
import { OdsCheckbox, OdsText } from '@ovhcloud/ods-components/react';
import { useServiceKeyOperationsTranslations } from '@/hooks/serviceKey/useServiceKeyOperationsTranslations';
import { OkmsServiceKeyReferenceOperations } from '@/types/okmsServiceKeyReference.type';

type TServiceKeyOperationCheckbox = {
  name: string;
  operation: OkmsServiceKeyReferenceOperations;
  onOdsChange?: (
    e: OdsCheckboxCustomEvent<OdsCheckboxChangeEventDetail>,
  ) => void;
} & Partial<OdsCheckboxType>;

export const ServiceKeyOperationCheckbox = ({
  operation,
  ...props
}: TServiceKeyOperationCheckbox) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const translatedOperations = useServiceKeyOperationsTranslations(
    operation.value,
  );
  const key = operation.value.join('_');

  return (
    <div className="flex items-center gap-3">
      <OdsCheckbox inputId={key} value={key} {...props} />
      <label htmlFor={key}>
        <OdsText className="block" preset={ODS_TEXT_PRESET.paragraph}>
          {translatedOperations.join(' / ')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t(
            `key_management_service_service-keys_create_crypto_field_usage_description_${key}`,
          )}
        </OdsText>
      </label>
    </div>
  );
};
