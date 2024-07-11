import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useParams } from 'react-router-dom';
import { OsdsDivider, OsdsText } from '@ovhcloud/ods-components/react';
import { Notifications } from '@ovhcloud/manager-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import KmsGuidesHeader from '@/components/Guide/KmsGuidesHeader';
import Dashboard, {
  DashboardTabItemProps,
} from '@/components/layout-helpers/Dashboard/Dashboard';
import Loading from '@/components/Loading/Loading';
import { useOKMSById } from '@/data/hooks/useOKMS';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { ROUTES_URLS } from '@/routes/routes.constants';

export default function DashboardPage() {
  const { t: tDashboard } = useTranslation('key-management-service/dashboard');
  const { okmsId } = useParams();
  const { data: okms } = useOKMSById(okmsId);
  const displayName = okms?.data?.iam?.displayName;

  const tabsList: DashboardTabItemProps[] = [
    {
      url: '',
      title: tDashboard('general_informations'),
    },
    {
      url: ROUTES_URLS.keys,
      title: tDashboard('encrypted_keys'),
    },
    {
      url: ROUTES_URLS.certificates,
      title: tDashboard('access_certificates'),
      disabled: true,
    },
  ];

  return (
    <div className="m-10">
      <Breadcrumb />
      <div className={'flex items-center justify-between mt-2'}>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
          size={ODS_THEME_TYPOGRAPHY_SIZE._600}
          color={ODS_THEME_COLOR_INTENT.primary}
        >
          {tDashboard('key_management_service_dashboard_title', {
            okmsId: displayName,
          })}
        </OsdsText>
        <KmsGuidesHeader />
      </div>
      <OsdsDivider></OsdsDivider>
      <Notifications />
      <Suspense fallback={<Loading />}>
        <Dashboard tabs={tabsList} />
        <Outlet />
      </Suspense>
    </div>
  );
}
