import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  NavLink,
  useNavigate,
  useResolvedPath,
  useParams,
} from 'react-router-dom';
import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
} from '@ovhcloud/ods-components/react';

import {
  BaseLayout,
  useServiceDetails,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.component';
import Errors from '@/components/Error/Error';
import { urls } from '@/routes/routes.constant';
import { useDetailsLicenseHYCU } from '@/hooks/api/license';
import { LicenseStatus } from '@/types/hycu.details.interface';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function DashboardPage() {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation('hycu/dashboard');
  const { addError, clearNotifications } = useNotifications();

  const { data: licenseHycu } = useDetailsLicenseHYCU(serviceName);
  const { data: serviceDetails, error } = useServiceDetails({
    resourceName: serviceName,
  });

  useEffect(() => {
    if (licenseHycu?.data.licenseStatus === LicenseStatus.ERROR) {
      clearNotifications();
      addError(
        t('hycu_dashboard_error_license_message', {
          error: licenseHycu.data.comment,
        }),
      );
    }
  }, [licenseHycu]);

  const tabsList = [
    {
      name: 'general_informations',
      title: t('hycu_dashboard_generals_informations_title'),
      to: useResolvedPath('').pathname,
    },
  ] as const;

  const panel = tabsList[0].name;

  const header = {
    title: serviceDetails?.data.resource.displayName,
    description: serviceName,
  };

  if (error) {
    return (
      <BaseLayout breadcrumb={<Breadcrumb />} header={header}>
        <Errors error={error} />
      </BaseLayout>
    );
  }

  return (
    <>
      <BaseLayout
        breadcrumb={<Breadcrumb />}
        header={header}
        backLinkLabel={t('hycu_dashboard_back_link')}
        onClickReturn={() => {
          navigate(urls.listing);
        }}
        message={<Notifications />}
        tabs={
          <OsdsTabs panel={panel}>
            <OsdsTabBar slot="top">
              {tabsList.map((tab: DashboardTabItemProps) => (
                <NavLink key={tab.name} to={tab.to} className="no-underline">
                  <OsdsTabBarItem
                    key={`osds-tab-bar-item-${tab.name}`}
                    panel={tab.name}
                  >
                    {tab.title}
                  </OsdsTabBarItem>
                </NavLink>
              ))}
            </OsdsTabBar>
          </OsdsTabs>
        }
      ></BaseLayout>
      <Outlet />
    </>
  );
}
