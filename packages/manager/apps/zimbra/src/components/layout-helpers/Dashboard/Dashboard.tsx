import React, { useContext } from 'react';
import { Outlet, useResolvedPath } from 'react-router-dom';

import {
  DashboardLayout,
  DashboardLayoutProps,
  GuideButton,
  GuideItem,
} from '@ovhcloud/manager-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import TabsPanel from './TabsPanel';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import { GUIDES_LIST } from '@/guides.constants';

import './Dashboard.scss';

export const Dashboard: React.FC<DashboardLayoutProps> = () => {
  const { t } = useTranslation('dashboard');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: `${GUIDES_LIST.administrator_guide.url[ovhSubsidiary] ||
        GUIDES_LIST.administrator_guide.url.DEFAULT}`,
      target: OdsHTMLAnchorElementTarget._blank,
      label: t('zimbra_dashboard_administrator_guide'),
    },
  ];

  const tabsList = [
    {
      name: 'general_informations',
      title: t('zimbra_dashboard_general_informations'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'organizations',
      title: t('zimbra_dashboard_organizations'),
      to: useResolvedPath('organizations').pathname,
    },
    {
      name: 'domains',
      title: t('zimbra_dashboard_domains'),
      to: useResolvedPath('domains').pathname,
    },
    {
      name: 'email_accounts',
      title: t('zimbra_dashboard_email_accounts'),
      to: useResolvedPath('email_accounts').pathname,
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
