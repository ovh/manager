import React, { useState, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
  useResolvedPath,
  useParams,
} from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  Breadcrumb,
  BaseLayout,
  HeadersProps,
  GuideButton,
  ChangelogButton,
} from '@ovh-ux/manager-react-components';

import appConfig from '@/hpc-vmware-vsphere.config';

import useGuideUtils from '@/hooks/guide/useGuideUtils';
import { VSPHERE_CHANGELOGS_LINKS } from './dashboard.constants';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function DashboardPage() {
  const [activePanel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { serviceName } = useParams();
  const shellNav = useContext(ShellContext).shell.navigation;
  const guides = useGuideUtils();

  const { t } = useTranslation('dashboard');

  const tabsList = [
    {
      name: 'general_informations',
      title: t('tabs_label_general_informations'),
      to: '',
      isRedirectLegacy: true,
    },
    {
      name: 'datacenters',
      title: t('tabs_label_datacenters'),
      to: useResolvedPath('datacenter').pathname,
      isRedirectLegacy: true,
    },
    {
      name: 'users',
      title: t('tabs_label_users'),
      to: useResolvedPath('users').pathname,
      isRedirectLegacy: true,
    },
    {
      name: 'security',
      title: t('tabs_label_security'),
      to: useResolvedPath('security').pathname,
      isRedirectLegacy: true,
    },
    {
      name: 'operations',
      title: t('tabs_label_operations'),
      to: useResolvedPath('operation').pathname,
      isRedirectLegacy: true,
    },
    {
      name: 'license',
      title: t('tabs_label_license'),
      to: useResolvedPath('license').pathname,
      isRedirectLegacy: true,
    },
    {
      name: 'logs',
      title: t('tabs_label_logs'),
      to: useResolvedPath('logs').pathname,
      isRedirectLegacy: false,
    },
  ];

  useEffect(() => {
    const activeTab = [...tabsList]
      .reverse()
      .find((tab) => location.pathname.startsWith(tab.to));
    if (activeTab) {
      if (activeTab.isRedirectLegacy) {
        shellNav.navigateTo(
          'dedicated',
          `/dedicated_cloud/${serviceName ?? ''}/${activeTab.to
            .split('/')
            .pop()}`,
          {},
        );
      } else {
        setActivePanel(activeTab.to);
      }
    } else {
      setActivePanel(tabsList[0].to);
      navigate(`${tabsList[0].to}`);
    }
  }, [location.pathname]);

  const header: HeadersProps = {
    title: serviceName,
    changelogButton: <ChangelogButton links={VSPHERE_CHANGELOGS_LINKS} />,
    headerButton: (
      <GuideButton
        items={[
          {
            id: 1,
            label: t('guides_label_discover'),
            href: guides.discover,
            target: '_blank',
          },
          {
            id: 2,
            label: t('guides_label_vsphere_access'),
            href: guides.vsphere_access,
            target: '_blank',
          },
          {
            id: 3,
            label: t('guides_label_veeam_backup'),
            href: guides.veeam_backup,
            target: '_blank',
          },
        ]}
      />
    ),
  };

  return (
    <BaseLayout
      breadcrumb={
        <Breadcrumb
          rootLabel={appConfig.rootLabel}
          appName="hpc-vmware-vsphere"
        />
      }
      header={header}
      tabs={
        <OdsTabs>
          {tabsList.map((tab: DashboardTabItemProps) => (
            <OdsTab
              key={`osds-tab-bar-item-${tab.name}`}
              isSelected={activePanel === tab.to}
            >
              <NavLink to={tab.to} className="no-underline">
                {tab.title}
              </NavLink>
            </OdsTab>
          ))}
        </OdsTabs>
      }
    >
      <Outlet />
    </BaseLayout>
  );
}
