import React from 'react';

import { ServiceKeyOperationCheckboxGroup } from '@key-management-service/pages/service-key/create/components/ServiceKeyOperationCheckboxGroup';
import {
  OkmsKeyTypes,
  OkmsServiceKeyOperations,
} from '@key-management-service/types/okmsServiceKey.type';
import { OkmsServiceKeyReference } from '@key-management-service/types/okmsServiceKeyReference.type';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { TrackingTags } from '@/tracking.constant';

export type KeyUsageSectionProps = {
  currentReference: OkmsServiceKeyReference | undefined;
  keyType: OkmsKeyTypes | undefined;
  keyOperations: OkmsServiceKeyOperations[];
  setKeyOperations: React.Dispatch<React.SetStateAction<OkmsServiceKeyOperations[]>>;
};

export const KeyUsageSection: React.FC<KeyUsageSectionProps> = ({
  currentReference,
  keyType,
  keyOperations,
  setKeyOperations,
}) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const { trackClick } = useOkmsTracking();

  const onCheckboxChange = (operations: OkmsServiceKeyOperations[]) => {
    setKeyOperations(operations);
    const newOperationsTrackingTag = operations.join('-') as TrackingTags;

    trackClick({
      location: PageLocation.funnel,
      buttonType: ButtonType.button,
      actionType: 'action',
      actions: ['select', 'usage', newOperationsTrackingTag],
    });
  };

  return (
    <div>
      <Text preset="label">
        <div className="mb-2 space-y-2">
          <Text className="block" preset="heading-5">
            {t('key_management_service_service-keys_create_crypto_field_usage_title')}
          </Text>
          <Text preset="paragraph">
            {t('key_management_service_service-keys_create_crypto_field_usage_subtitle')}
          </Text>
        </div>
      </Text>

      <ServiceKeyOperationCheckboxGroup
        referenceOperations={currentReference?.operations}
        selectedOperations={keyOperations}
        disabled={keyType === OkmsKeyTypes.EC || keyType === OkmsKeyTypes.RSA}
        onCheckboxChange={onCheckboxChange}
      />
    </div>
  );
};
