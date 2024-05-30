import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useResolvedPath } from 'react-router-dom';
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
import { useOKMSById } from '@/hooks/useOKMS';

export default function DashboardPage() {
  const { t: tDashboard } = useTranslation('key-management-service/dashboard');
  const { t: tListing } = useTranslation('key-management-service/listing');
  const { okmsId } = useParams();
  const navigate = useNavigate();
  const { data: okms } = useOKMSById(okmsId);
  const displayName = okms?.data?.iam?.displayName;

  const tabsList = [
    {
      name: 'general_infos',
      title: tDashboard('general_informations'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'encrypted_keys',
      title: tDashboard('encrypted_keys'),
      disabled: true,
    },
    {
      name: 'certificates',
      title: tDashboard('access_certificates'),
      disabled: true,
    },
  ];

  return (
    <div>
      <OsdsBreadcrumb
        items={[
          {
            label: tListing('key_management_service_listing_title'),
            onClick: () => navigate(ROUTES_URLS.listing),
          },
          {
            href: ROUTES_URLS.dashboard,
            label: okmsId,
          },
        ].filter(Boolean)}
      ></OsdsBreadcrumb>
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
      </Suspense>
    </div>
  );
}
