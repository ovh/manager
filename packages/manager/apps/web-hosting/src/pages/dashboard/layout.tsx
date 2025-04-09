import React, { useEffect, useContext, useMemo } from 'react';
import {
  NavLink,
  Outlet,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BaseLayout, Breadcrumb } from '@ovh-ux/manager-react-components';
import { OdsTab, OdsTabs } from '@ovhcloud/ods-components/react';
import {
  useRouteSynchro,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { useGetHostingService } from '@/data/hooks/useDashboard';
import { DashboardTab } from '@/types/ssl';

export default function Layout() {
  const { shell } = useContext(ShellContext);
  const { serviceName } = useParams();
  const { t } = useTranslation('dashboard');

  const { data } = useGetHostingService(serviceName);
  const { pathname: path } = useLocation();

  const tabs: DashboardTab[] = [
    {
      name: 'general_information',
      title: t('hosting_tab_GENERAL_INFORMATIONS'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'multisite',
      title: t('hosting_tab_MULTISITE'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'ssl',
      title: t('hosting_tab_SSL'),
      to: useResolvedPath('ssl').pathname,
    },
    {
      name: 'module',
      title: t('hosting_tab_MODULE'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'logs',
      title: t('hosting_tab_USER_LOGS'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'ftp',
      title: t('hosting_tab_FTP'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'database',
      title: t('hosting_tab_DATABASE'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'task',
      title: t('hosting_tab_TASK'),
      to: useResolvedPath('').pathname,
    },
  ];

  useRouteSynchro();

  const activeTab = useMemo(() => {
    const getActiveTab = () => tabs.find((tab) => tab.to === path);

    return getActiveTab();
  }, [tabs, path]);

  useEffect(() => {
    shell.ux.hidePreloader();
  }, []);

  return (
    <BaseLayout
      tabs={
        <OdsTabs>
          {tabs.map((tab: DashboardTab) => (
            <NavLink to={tab.to} className="no-underline" key={tab.name}>
              <OdsTab isSelected={tab.name === activeTab?.name}>
                {tab.title}
              </OdsTab>
            </NavLink>
          ))}
        </OdsTabs>
      }
    >
      <Outlet />
    </BaseLayout>
  );
}
