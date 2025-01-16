import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import {
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
} from '@ovhcloud/ods-components/react';

import {
  BaseLayout,
  ChangelogButton,
  ChangelogItem,
} from '@ovh-ux/manager-react-components';

import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.component';
import { CHANGELOG_DESTINATION, CHANGELOG_PREFIXES, GO_TO } from '@/constants';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function DashboardPage() {
  const [panel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('dashboard');
  const { trackClick } = useOvhTracking();

  const changelogItems: ChangelogItem[] = [
    {
      id: 1,
      href:
        'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Backup+and+Disaster+Recovery',
      target: OdsHTMLAnchorElementTarget._blank,
      labelKey: 'roadmap',
      onClick: () => {
        trackClick({
          actionType: 'navigation',
          actions: [
            ...CHANGELOG_PREFIXES,
            GO_TO(CHANGELOG_DESTINATION.CHANGELOG),
          ],
        });
      },
    },
    {
      id: 2,
      href:
        'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Backup+and+Disaster+Recovery',
      target: OdsHTMLAnchorElementTarget._blank,
      labelKey: 'changelog',
      onClick: () => {
        trackClick({
          actionType: 'navigation',
          actions: [
            ...CHANGELOG_PREFIXES,
            GO_TO(CHANGELOG_DESTINATION.CHANGELOG),
          ],
        });
      },
    },
    {
      id: 3,
      href: 'https://github.com/ovh/private-cloud-roadmap/issues/new',
      target: OdsHTMLAnchorElementTarget._blank,
      labelKey: 'feature-request',
      onClick: () => {
        trackClick({
          actionType: 'navigation',
          actions: [
            ...CHANGELOG_PREFIXES,
            GO_TO(CHANGELOG_DESTINATION.CHANGELOG),
          ],
        });
      },
    },
  ];

  const tabsList = [
    {
      name: 'general_informations',
      title: 'Informations générales',
      to: useResolvedPath('').pathname,
    },
    {
      name: 'Tab 2',
      title: 'Tab 2',
      to: useResolvedPath('Tab2').pathname,
    },
  ] as const;

  useEffect(() => {
    const activeTab = tabsList.find((tab) => tab.to === location.pathname);
    if (activeTab) {
      setActivePanel(activeTab.name);
    } else {
      setActivePanel(tabsList[0].name);
      navigate(`${tabsList[0].to}`);
    }
  }, [location.pathname]);

  const header = {
    title: t('title'),
    headerButton: <ChangelogButton items={changelogItems} />,
  };

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={header}
      description="Description du hycu"
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
