import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useNavigate,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { BaseLayout } from '@ovh-ux/manager-react-components';
import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import { Breadcrumb } from '@/components/Breadcrumb/Breadcrumb';
import { urls } from '@/routes/routes.constants';
import TabsPanel from '@/components/layout-helpers/Dashboard/TabsPanel';
import { useOfficeParentTenant, UseGenerateUrl } from '@/hooks';
import { ParentTenantType } from '@/api/parentTenant';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  pathMatchers?: RegExp[];
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function DashboardPage() {
  const { serviceName } = useParams();
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();

  const basePath = useResolvedPath('').pathname;
  const { data } = useOfficeParentTenant() as {
    data?: ParentTenantType;
  };

  const hrefEditName = UseGenerateUrl('./edit-name', 'path');

  const handleEditNamelick = () => {
    navigate(hrefEditName);
  };

  function computePathMatchers(routes: string[]) {
    return routes.map(
      (path) => new RegExp(path.replace(':serviceName', serviceName)),
    );
  }

  const tabsList: DashboardTabItemProps[] = [
    {
      name: 'license',
      title: t('microsoft_office_dashboard_licenses'),
      to: basePath,
      pathMatchers: computePathMatchers([urls.license]),
    },
    {
      name: 'consumption',
      title: t('microsoft_office_dashboard_consumption'),
      to: `${basePath}/consumption`,
      pathMatchers: computePathMatchers([urls.consumption]),
    },
  ];

  const header = {
    title: (
      <>
        <OdsText preset={ODS_TEXT_PRESET.heading6}>
          {t('microsoft_office_dashboard_licenses_group')}
        </OdsText>
        <div className="flex items-center justify-between">
          <div>{data?.displayName}</div>
          <OdsButton
            label=""
            icon={ODS_ICON_NAME.pen}
            variant={ODS_BUTTON_VARIANT.ghost}
            onClick={handleEditNamelick}
            className="ml-4"
          />
        </div>
        <OdsText preset={ODS_TEXT_PRESET.paragraph}>
          {data?.serviceName}
        </OdsText>
      </>
    ),
  };

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={header}
      tabs={<TabsPanel tabs={tabsList} />}
    >
      <Outlet />
    </BaseLayout>
  );
}
