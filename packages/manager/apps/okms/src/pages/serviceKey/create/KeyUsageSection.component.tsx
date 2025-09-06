import React from 'react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsFormField, OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  OkmsServiceKeyReference,
  OkmsServiceKeyReferenceOperations,
} from '@/types/okmsServiceKeyReference.type';
import {
  OkmsKeyTypes,
  OkmsServiceKeyOperations,
} from '@/types/okmsServiceKey.type';
import { ServiceKeyOperationCheckbox } from '@/components/serviceKey/create/serviceKeyOperationCheckbox';

export type KeyUsageSectionProps = {
  serviceKey: OkmsServiceKeyReference | undefined;
  keyType: OkmsKeyTypes | undefined;
  keyOperations: OkmsServiceKeyOperations[][];
  setKeyOperations: React.Dispatch<
    React.SetStateAction<OkmsServiceKeyOperations[][]>
  >;
};

export const KeyUsageSection: React.FC<KeyUsageSectionProps> = ({
  serviceKey,
  keyType,
  keyOperations,
  setKeyOperations,
}) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { trackClick } = useOvhTracking();

  React.useEffect(() => {
    serviceKey?.operations.forEach((operation) => {
      if (operation.default) {
        setKeyOperations([operation.value]);
      }
    });
  }, [serviceKey]);

  const onCheckboxChange = (operation: OkmsServiceKeyReferenceOperations) => {
    setKeyOperations((prev) => {
      const newOperations: OkmsServiceKeyOperations[][] = prev.includes(
        operation.value,
      )
        ? prev.filter((op) => op !== operation.value)
        : [...prev, operation.value];
      trackClick({
        location: PageLocation.funnel,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: ['select_use_key', newOperations.flat().join('_')],
      });
      return newOperations;
    });
  };

  return (
    <OdsFormField>
      <div slot="label" className="space-y-2 mb-2">
        <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
          {t(
            'key_management_service_service-keys_create_crypto_field_usage_title',
          )}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t(
            'key_management_service_service-keys_create_crypto_field_usage_subtitle',
          )}
        </OdsText>
      </div>
      <div className="grid gap-2">
        {serviceKey?.operations.map((operation) => (
          <ServiceKeyOperationCheckbox
            name="serviceKeyOperation"
            key={operation.value[0]}
            operation={operation}
            isChecked={keyOperations?.includes(operation.value)}
            isDisabled={
              keyType === OkmsKeyTypes.EC || keyType === OkmsKeyTypes.RSA
            }
            onOdsChange={() => onCheckboxChange(operation)}
          />
        ))}
      </div>
    </OdsFormField>
  );
};
