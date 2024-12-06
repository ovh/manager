import { OsdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';

export default function SeeRequest() {
  const { t } = useTranslation('account-disable-2fa/error');

  return (
    <div className="lg:px-20 sm:px-6 lg:py-10 sm:py-6 flex flex-col gap-4">
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.info}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        className="block mb-6"
        size={ODS_TEXT_SIZE._500}
      >
        {t('account-disable-2fa-error-validation')}
      </OsdsText>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        className="block"
        size={ODS_TEXT_SIZE._400}
      >
        {t('account-disable-2fa-error-verification')}
      </OsdsText>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        className="block"
        size={ODS_TEXT_SIZE._400}
      >
        {t('account-disable-2fa-error-suggestion')}
      </OsdsText>
    </div>
  );
}
