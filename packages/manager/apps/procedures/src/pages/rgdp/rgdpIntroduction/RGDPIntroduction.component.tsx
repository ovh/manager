import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { Trans, useTranslation } from 'react-i18next';
import React, { FunctionComponent } from 'react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';

export const RGDPIntroduction: FunctionComponent = () => {
  const { t } = useTranslation('rgdp');

  return (
    <>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.info}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        className="block mb-6 text-center"
        size={ODS_TEXT_SIZE._500}
      >
        {t('rgdp_introduction_title')}
      </OsdsText>

      <div className="flex flex-col gap-4">
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._500}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        >
          {t('rgdp_introduction_content_purpose')}
        </OsdsText>
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._500}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        >
          {t('rgdp_introduction_content_identity_verification')}
        </OsdsText>
        <OsdsText
          class="mt-2"
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._500}
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        >
          <Trans t={t} i18nKey={'rgdp_introduction_please_note'}></Trans>
        </OsdsText>
      </div>
    </>
  );
};
