import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useNavigate,
  useResolvedPath,
  useParams,
  Outlet,
} from 'react-router-dom';
import {
  Message,
  MessageIcon,
  MessageBody,
  MESSAGE_COLOR,
  Tabs,
  TabList,
  Tab,
  ICON_NAME,
  TabsValueChangeEvent,
} from '@ovhcloud/ods-react';
import {
  Text,
  TEXT_PRESET,
  BaseLayout,
  Notifications,
  ChangelogMenu,
} from '@ovh-ux/muk';
import { useServiceDetails } from '@ovh-ux/manager-module-common-api';

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
    <Message className="mb-2" color={MESSAGE_COLOR.warning} dismissible={false}>
      <MessageIcon name={ICON_NAME.triangleExclamation} />
      <MessageBody>
        <Text preset={TEXT_PRESET.paragraph}>
          {t(`${NAMESPACES.BILLING}:cancel_service_success`)}
        </Text>
      </MessageBody>
    </Message>
  );
};

const LicenseErrorActivationBanner = ({
  licenseHycu,
}: {
  licenseHycu: IHycuDetails;
}) => {
  const { t } = useTranslation('hycu/dashboard');

  return (
    <Message
      className="mb-2"
      color={MESSAGE_COLOR.critical}
      dismissible={false}
    >
      <MessageIcon name={ICON_NAME.circleXmark} />
      <MessageBody>
        <Text preset={TEXT_PRESET.paragraph}>
          {t('hycu_dashboard_error_license_message', {
            error: licenseHycu.comment,
          })}
        </Text>
      </MessageBody>
    </Message>
  );
};

export default function DashboardPage() {
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<string>();
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

  const handleValueChange = (event: TabsValueChangeEvent) => {
    const tab = tabsList.filter(({ name }) => name === event.value)?.[0];
    navigate(tab.to);
    setSelectedTab(event.value);
  };

  const panel = tabsList[0].name;

  const header = {
    title: serviceDetails?.data.resource.displayName,
    changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} />,
  };

  if (error) {
    return (
      <BaseLayout
        breadcrumb={<Breadcrumb />}
        header={header}
        description={serviceName}
      >
        <Errors error={error} />
      </BaseLayout>
    );
  }

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={header}
      description={serviceName}
      backLink={{
        label: t(`${NAMESPACES.ACTIONS}:back_to_list`),
        onClick: () => {
          navigate(urls.listing);
        },
      }}
      message={
        <>
          {dashboardBanner}
          <Notifications />
        </>
      }
      tabs={
        <Tabs
          defaultValue={panel}
          onValueChange={handleValueChange}
          value={selectedTab}
        >
          <TabList>
            {tabsList.map((tab: DashboardTabItemProps) => (
              <Tab key={`osds-tab-bar-item-${tab.name}`} value={tab.name}>
                {tab.title}
              </Tab>
            ))}
          </TabList>
        </Tabs>
      }
    >
      <Outlet />
    </BaseLayout>
  );
}
