import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { ODS_RADIO_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OsdsRadioButton, OsdsText } from '@ovhcloud/ods-components/react';
import { useServiceKeyTypeTranslations } from '@/hooks/serviceKey/useServiceKeyTypeTranslations';
import { OkmsKeyTypes } from '@/types/okmsServiceKey.type';

type TServiceKeyTypeRadioButton = {
  type: OkmsKeyTypes;
  onClick: React.MouseEventHandler<HTMLOsdsRadioButtonElement>;
};

export const ServiceKeyTypeRadioButton = ({
  type,
  onClick,
}: TServiceKeyTypeRadioButton) => {
  const { t } = useTranslation('key-management-service/serviceKeys');
  const translatedType = useServiceKeyTypeTranslations(type);

  return (
    <OsdsRadioButton
      size={ODS_RADIO_BUTTON_SIZE.sm}
      color={ODS_THEME_COLOR_INTENT.primary}
      onClick={onClick}
    >
      <span slot="end">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        >
          {translatedType}
        </OsdsText>
        <OsdsText color={ODS_THEME_COLOR_INTENT.text}>
          {t(
            `key_management_service_service-keys_create_crypto_field_type_description_${type.toLowerCase()}`,
          )}
        </OsdsText>
      </span>
    </OsdsRadioButton>
  );
};
