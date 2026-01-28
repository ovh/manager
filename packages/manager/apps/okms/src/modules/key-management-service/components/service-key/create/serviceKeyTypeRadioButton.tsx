import React from 'react';

import { useServiceKeyTypeTranslations } from '@key-management-service/hooks/service-key/useServiceKeyTypeTranslations';
import { OkmsKeyTypes } from '@key-management-service/types/okmsServiceKey.type';
import { useTranslation } from 'react-i18next';

import { OdsRadio as OdsRadioType } from '@ovhcloud/ods-components';
import { OdsRadio } from '@ovhcloud/ods-components/react';
import { Text } from '@ovhcloud/ods-react';

type TServiceKeyTypeRadioButton = {
  name: string;
  type: OkmsKeyTypes;
  onClick: React.MouseEventHandler<HTMLOdsRadioElement>;
} & Partial<OdsRadioType>;

export const ServiceKeyTypeRadioButton = ({ type, ...props }: TServiceKeyTypeRadioButton) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const translatedType = useServiceKeyTypeTranslations(type);
  const buttonId = `serviceKeyType-${type}`;

  return (
    <div className="flex items-center gap-3">
      <OdsRadio inputId={buttonId} {...props} />
      <label htmlFor={buttonId}>
        <Text className="block" preset="paragraph">
          {translatedType}
        </Text>
        <Text preset="caption">
          {t(
            `key_management_service_service-keys_create_crypto_field_type_description_${type.toLowerCase()}`,
          )}
        </Text>
      </label>
    </div>
  );
};
