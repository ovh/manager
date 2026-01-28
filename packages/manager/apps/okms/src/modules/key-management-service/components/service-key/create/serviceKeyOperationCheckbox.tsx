import { useServiceKeyOperationsTranslations } from '@key-management-service/hooks/service-key/useServiceKeyOperationsTranslations';
import { OkmsServiceKeyReferenceOperations } from '@key-management-service/types/okmsServiceKeyReference.type';
import { useTranslation } from 'react-i18next';

import {
  OdsCheckboxChangeEventDetail,
  OdsCheckboxCustomEvent,
  OdsCheckbox as OdsCheckboxType,
} from '@ovhcloud/ods-components';
import { OdsCheckbox } from '@ovhcloud/ods-components/react';
import { Text } from '@ovhcloud/ods-react';

type TServiceKeyOperationCheckbox = {
  name: string;
  operation: OkmsServiceKeyReferenceOperations;
  onOdsChange?: (e: OdsCheckboxCustomEvent<OdsCheckboxChangeEventDetail>) => void;
} & Partial<OdsCheckboxType>;

export const ServiceKeyOperationCheckbox = ({
  operation,
  ...props
}: TServiceKeyOperationCheckbox) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const translatedOperations = useServiceKeyOperationsTranslations(operation.value);
  const key = operation.value.join('_');

  return (
    <div className="flex items-center gap-3">
      <OdsCheckbox inputId={key} value={key} {...props} />
      <label htmlFor={key}>
        <Text className="block" preset="paragraph">
          {translatedOperations.join(' / ')}
        </Text>
        <Text preset="caption">
          {t(`key_management_service_service-keys_create_crypto_field_usage_description_${key}`)}
        </Text>
      </label>
    </div>
  );
};
