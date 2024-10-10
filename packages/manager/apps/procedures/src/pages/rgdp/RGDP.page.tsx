import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
} from '@ovhcloud/ods-common-theming';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { Outlet } from 'react-router-dom';
import React from 'react';
import { PageLayout } from '@/components/PageLayout/PageLayout.component';

export default function RGDP() {
  const { t } = useTranslation('rgdp');

  return (
    <PageLayout>
      <OsdsText
        color={ODS_THEME_COLOR_INTENT.info}
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        className="block mb-6 text-center"
        size={ODS_TEXT_SIZE._500}
      >
        {t('rgdp-title')}
      </OsdsText>
      <Outlet />
    </PageLayout>
  );
}
