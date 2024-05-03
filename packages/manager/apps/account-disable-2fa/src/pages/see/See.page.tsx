import { OsdsIcon, OsdsLink, OsdsText } from '@ovhcloud/ods-components/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';

export default function SeeRequest() {
  const { t } = useTranslation('account-disable-2fa');
  const { t: tsub } = useTranslation('account-disable-2fa-sub');

  return (
    <div className="lg:px-20 sm:px-6 lg:py-10 sm:py-6 flex flex-col gap-4 justify-between">
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.info}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        className="block mb-6"
        size={ODS_TEXT_SIZE._500}
      >
        {t('account-disable-2fa-see-title')}
      </OsdsText>

      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        className="block"
        size={ODS_TEXT_SIZE._400}
      >
        {t('account-disable-2fa-see-description1')}
      </OsdsText>

      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        className="block"
        size={ODS_TEXT_SIZE._400}
      >
        {t('account-disable-2fa-see-description2')}
      </OsdsText>

      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        className="block"
        size={ODS_TEXT_SIZE._400}
      >
        {tsub('account-disable-2fa-contact-availability')}
      </OsdsText>

      <OsdsText
        color={ODS_THEME_COLOR_INTENT.text}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        className="block"
        size={ODS_TEXT_SIZE._400}
      >
        <span
          dangerouslySetInnerHTML={{
            __html: tsub('account-disable-2fa-contact-phone'),
          }}
        ></span>
      </OsdsText>

      <OsdsLink
        color={ODS_THEME_COLOR_INTENT.primary}
        className="mt-auto"
        href="https://ovhcloud.com"
      >
        {t('account-disable-2fa-back-home')}
        <span slot="end">
          <OsdsIcon
            name={ODS_ICON_NAME.ARROW_RIGHT}
            size={ODS_ICON_SIZE.xs}
            hoverable
          ></OsdsIcon>
        </span>
      </OsdsLink>
    </div>
  );
}
