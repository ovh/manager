import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useNavigate,
  useResolvedPath,
  useParams,
  NavLink,
  Outlet,
} from 'react-router-dom';
import { ODS_THEME_TYPOGRAPHY_SIZE } from '@ovhcloud/ods-common-theming';
import {
  ODS_MESSAGE_TYPE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import {
  OsdsMessage,
  OsdsText,
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
} from '@ovhcloud/ods-components/react';

import {
  BaseLayout,
  useServiceDetails,
  Notifications,
  ChangelogButton,
} from '@ovh-ux/manager-react-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { CHANGELOG_LINKS } from '@/constants';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.component';
import Errors from '@/components/Error/Error';
import { urls } from '@/routes/routes.constant';
import { useDetailsLicenseHYCU } from '@/hooks/api/license';
import { IHycuDetails, LicenseStatus } from '@/types/hycu.details.interface';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

const ServiceSuspendedBanner = () => {
  const { t } = useTranslation(['hycu/dashboard', NAMESPACES.BILLING]);

  return (
    <OsdsMessage className="mb-2" type={ODS_MESSAGE_TYPE.warning}>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.warning}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {t(`${NAMESPACES.BILLING}:cancel_service_success`)}
      </OsdsText>
    </OsdsMessage>
  );
};

const LicenseErrorActivationBanner = ({
  licenseHycu,
}: {
  licenseHycu: IHycuDetails;
}) => {
  const { t } = useTranslation('hycu/dashboard');

  return (
    <OsdsMessage className="mb-2" type={ODS_MESSAGE_TYPE.error}>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.error}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
      >
        {t('hycu_dashboard_error_license_message', {
          error: licenseHycu.comment,
        })}
      </OsdsText>
    </OsdsMessage>
  );
};

export default function DashboardPage() {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation([NAMESPACES.DASHBOARD, NAMESPACES.ACTIONS]);

  const { data: licenseHycu } = useDetailsLicenseHYCU(serviceName);
  const { data: serviceDetails, error } = useServiceDetails({
    resourceName: serviceName,
  });

  const dashboardBanner = useMemo(() => {
    if (serviceDetails?.data.resource.state === 'suspended') {
      return <ServiceSuspendedBanner />;
    }
    if (licenseHycu?.data.licenseStatus === LicenseStatus.ERROR) {
      return <LicenseErrorActivationBanner licenseHycu={licenseHycu.data} />;
    }

    return null;
  }, [licenseHycu, serviceDetails]);

  const tabsList = [
    {
      name: 'general_informations',
      title: t(`${NAMESPACES.DASHBOARD}:general_information`),
      to: useResolvedPath('').pathname,
    },
  ] as const;

  const panel = tabsList[0].name;

  const header = {
    title: serviceDetails?.data.resource.displayName,
    description: serviceName,
    changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
  };

  if (error) {
    return (
      <BaseLayout breadcrumb={<Breadcrumb />} header={header}>
        <Errors error={error} />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={header}
      backLinkLabel={t(`${NAMESPACES.ACTIONS}:back_to_list`)}
      onClickReturn={() => {
        navigate(urls.listing);
      }}
      message={
        <>
          {dashboardBanner}
          <Notifications />
        </>
      }
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
    >
      <Outlet />
    </BaseLayout>
  );
}
