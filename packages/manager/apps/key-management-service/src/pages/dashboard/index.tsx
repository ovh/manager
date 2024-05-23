import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useResolvedPath } from 'react-router-dom';
import {
  OsdsBreadcrumb,
  OsdsDivider,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { Notifications } from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import Dashboard from '@/components/layout-helpers/Dashboard/Dashboard';
import Loading from '@/components/Loading/Loading';
import { ROUTES_URLS } from '@/routes/routes.constants';

export default function DashboardPage() {
  const { t } = useTranslation('key-management-service/dashboard');
  const tabsList = [
    {
      name: 'general_infos',
      title: t('general_informations'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'custom tab',
      title: 'custom tab',
      to: useResolvedPath('Tabs2').pathname,
    },
  ];

  return (
    <div>
      <OsdsBreadcrumb
        items={[
          {
            href: ROUTES_URLS.listing,
            label: t('key_management_service_dashboard_title'),
          },
        ]}
      ></OsdsBreadcrumb>
      <div className={'flex items-center justify-between mt-4'}>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {t('key_management_service_dashboard_title')}
        </OsdsText>
        <KmsGuidesHeader />
      </div>
      <OsdsDivider></OsdsDivider>
      <Notifications />
      <Suspense fallback={<Loading />}>
        <Dashboard tabs={tabsList} />
      </Suspense>
    </div>
  );
}
