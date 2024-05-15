import React, { useContext } from 'react';
import { Outlet, useResolvedPath, useLocation } from 'react-router-dom';

import {
  DashboardLayout,
  DashboardLayoutProps,
  GuideButton,
  GuideItem,
} from '@ovhcloud/manager-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import TabsPanel, { TabItemProps } from './TabsPanel';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { GUIDES_LIST } from '@/guides.constants';

import './Dashboard.scss';

export const Dashboard: React.FC<DashboardLayoutProps> = () => {
  const { t } = useTranslation('dashboard');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const location = useLocation();
  const basePath = useResolvedPath('').pathname;

  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: `${GUIDES_LIST.administrator_guide.url[ovhSubsidiary] ||
        GUIDES_LIST.administrator_guide.url.DEFAULT}`,
      target: OdsHTMLAnchorElementTarget._blank,
      label: t('zimbra_dashboard_administrator_guide'),
    },
  ];

  const params = new URLSearchParams(location.search);
  const selectedOrganizationId = params.get('organizationId');
  const tabsList: TabItemProps[] = [
    {
      name: 'general_informations',
      title: t('zimbra_dashboard_general_informations'),
      to: basePath,
    },
    {
      name: 'organizations',
      title: t('zimbra_dashboard_organizations'),
      to: `${basePath}/organizations`,
      hidden: selectedOrganizationId !== null,
    },
    {
      name: 'domains',
      title: t('zimbra_dashboard_domains'),
      to: `${basePath}/domains`,
    },
    {
      name: 'email_accounts',
      title: t('zimbra_dashboard_email_accounts'),
      to: `${basePath}/email_accounts`,
    },
  ];

  return (
    <DashboardLayout
      header={{
        title: 'Zimbra',
        headerButton: <GuideButton items={guideItems} />,
      }}
      breadcrumb={<Breadcrumb />}
      tabs={<TabsPanel tabs={tabsList} />}
      content={<Outlet />}
    />
  );
};

export default Dashboard;
