import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_TEXT_PRESET,
  OdsRadio as OdsRadioType,
} from '@ovhcloud/ods-components';
import { OdsRadio, OdsText } from '@ovhcloud/ods-components/react';
import { useServiceKeyTypeTranslations } from '@/hooks/serviceKey/useServiceKeyTypeTranslations';
import { OkmsKeyTypes } from '@/types/okmsServiceKey.type';

type TServiceKeyTypeRadioButton = {
  name: string;
  type: OkmsKeyTypes;
  onClick: React.MouseEventHandler<HTMLOdsRadioElement>;
} & Partial<OdsRadioType>;

export const ServiceKeyTypeRadioButton = ({
  type,
  ...props
}: TServiceKeyTypeRadioButton) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const translatedType = useServiceKeyTypeTranslations(type);
  const buttonId = `serviceKeyType-${type}`;

  return (
    <div className="flex items-center gap-3">
      <OdsRadio inputId={buttonId} {...props} />
      <label htmlFor={buttonId}>
        <OdsText className="block" preset={ODS_TEXT_PRESET.paragraph}>
          {translatedType}
        </OdsText>
        <OdsText preset={ODS_TEXT_PRESET.caption}>
          {t(
            `key_management_service_service-keys_create_crypto_field_type_description_${type.toLowerCase()}`,
          )}
        </OdsText>
      </label>
    </div>
  );
};
