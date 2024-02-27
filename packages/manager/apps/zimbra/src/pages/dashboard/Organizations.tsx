import React from 'react';
import { useTranslation } from 'react-i18next';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';

export default function Organizations() {
  const { t } = useTranslation('zimbra/organisations');
  return (
    <div className="py-6">
      <OsdsButton
        color={ODS_THEME_COLOR_INTENT.primary}
        inline={true}
        size={ODS_BUTTON_SIZE.sm}
      >
        <span slot="start">
          <OsdsIcon name={ODS_ICON_NAME.PLUS}></OsdsIcon>
        </span>
        <span slot="end">{t('add_organisation_cta')}</span>
      </OsdsButton>
    </div>
  );
}
