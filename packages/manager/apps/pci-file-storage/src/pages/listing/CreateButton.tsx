import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';

const CreateButton = () => {
  const { t } = useTranslation('pci-file-storage/listing');
  return (
    <OsdsButton
      size={ODS_BUTTON_SIZE.sm}
      variant={ODS_BUTTON_VARIANT.stroked}
      color={ODS_THEME_COLOR_INTENT.primary}
      inline
    >
      <span slot="start" className="flex justify-center items-center">
        <OsdsIcon
          name={ODS_ICON_NAME.ADD}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="mr-4"
        />
        <span>{t('action_create')}</span>
      </span>
    </OsdsButton>
  );
};

export default CreateButton;
