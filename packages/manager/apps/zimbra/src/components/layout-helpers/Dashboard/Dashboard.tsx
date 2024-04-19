import React, { useState } from 'react';
import { Outlet, useResolvedPath } from 'react-router-dom';

import {
  DashboardLayout,
  DashboardLayoutProps,
  GuideButton,
  GuideItem,
} from '@ovhcloud/manager-components';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import { useTranslation } from 'react-i18next';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import TabsPanel from './TabsPanel';

export const Dashboard: React.FC<DashboardLayoutProps> = () => {
  const { t } = useTranslation('zimbra/dashboard');

  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: 'https://www.ovh.com',
      target: OdsHTMLAnchorElementTarget._blank,
      label: t('guides_title_1'),
    },
  ];

  const tabsList = [
    {
      name: 'general_informations',
      title: t('general_informations'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'organizations',
      title: t('organizations'),
      to: useResolvedPath('organizations').pathname,
    },
    {
      name: 'domains',
      title: t('domains'),
      to: useResolvedPath('domains').pathname,
    },
    {
      name: 'email_accounts',
      title: t('email_accounts'),
      to: useResolvedPath('email_accounts').pathname,
    },
    {
      name: 'mailing_lists',
      title: t('mailing_lists'),
      to: useResolvedPath('mailing_lists').pathname,
    },
    {
      name: 'redirections',
      title: t('redirections'),
      to: useResolvedPath('redirections').pathname,
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
