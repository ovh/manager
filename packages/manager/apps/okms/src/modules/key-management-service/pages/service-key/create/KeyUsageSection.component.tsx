import React from 'react';

import { ServiceKeyOperationCheckbox } from '@key-management-service/components/service-key/create/serviceKeyOperationCheckbox';
import {
  OkmsKeyTypes,
  OkmsServiceKeyOperations,
} from '@key-management-service/types/okmsServiceKey.type';
import {
  OkmsServiceKeyReference,
  OkmsServiceKeyReferenceOperations,
} from '@key-management-service/types/okmsServiceKeyReference.type';
import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsFormField, OdsText } from '@ovhcloud/ods-components/react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { TrackingTags } from '@/tracking.constant';

export type KeyUsageSectionProps = {
  serviceKey: OkmsServiceKeyReference | undefined;
  keyType: OkmsKeyTypes | undefined;
  keyOperations: OkmsServiceKeyOperations[][];
  setKeyOperations: React.Dispatch<React.SetStateAction<OkmsServiceKeyOperations[][]>>;
};

export const KeyUsageSection: React.FC<KeyUsageSectionProps> = ({
  serviceKey,
  keyType,
  keyOperations,
  setKeyOperations,
}) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { trackClick } = useOkmsTracking();

  React.useEffect(() => {
    serviceKey?.operations.forEach((operation) => {
      if (operation.default) {
        setKeyOperations([operation.value]);
      }
    });
  }, [serviceKey, setKeyOperations]);

  const onCheckboxChange = (operation: OkmsServiceKeyReferenceOperations) => {
    setKeyOperations((prev) => {
      const newOperations: OkmsServiceKeyOperations[][] = prev.includes(operation.value)
        ? prev.filter((op) => op !== operation.value)
        : [...prev, operation.value];

      const newOperationsTrackingTag = newOperations.flat().join('-') as TrackingTags;

      trackClick({
        location: PageLocation.funnel,
        buttonType: ButtonType.button,
        actionType: 'action',
        actions: ['select', 'usage', newOperationsTrackingTag],
      });
      return newOperations;
    });
  };

  return (
    <OdsFormField>
      <div slot="label" className="mb-2 space-y-2">
        <OdsText className="block" preset={ODS_TEXT_PRESET.heading5}>
          {t('key_management_service_service-keys_create_crypto_field_usage_title')}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {t('key_management_service_service-keys_create_crypto_field_usage_subtitle')}
        </OdsText>
      </div>
      <div className="grid gap-2">
        {serviceKey?.operations.map((operation) => (
          <ServiceKeyOperationCheckbox
            name="serviceKeyOperation"
            key={operation.value[0]}
            operation={operation}
            isChecked={keyOperations?.includes(operation.value)}
            isDisabled={keyType === OkmsKeyTypes.EC || keyType === OkmsKeyTypes.RSA}
            onOdsChange={() => onCheckboxChange(operation)}
          />
        ))}
      </div>
    </OdsFormField>
  );
};
