import React, { useState, useEffect } from 'react';
import {
  useResolvedPath,
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
  useHref,
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsChip,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';

import { DashboardLayout, LinkType } from '@ovhcloud/manager-components';

import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

import { useShare } from '@/api/hooks/useShare';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
  disabled?: boolean;
  badge?: string;
  tooltip?: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function DashboardPage() {
  const [panel, setActivePanel] = useState('');
  const { projectId, regionName, serviceName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('pci-file-storage/dashboard');
  const { data }: any = useShare({
    projectId,
    regionName,
    shareId: serviceName,
  });

  const tabsList: DashboardTabItemProps[] = [
    {
      name: 'general_informations',
      title: t('general_information'),
      to: useResolvedPath('').pathname,
    },
    {
      name: 'snapshot',
      title: t('snapshot'),
      to: useResolvedPath('/na').pathname,
      disabled: true,
      badge: t('coming_soon'),
      tooltip: t('coming_soon'),
    },
    {
      name: 'acl',
      title: t('acl'),
      to: useResolvedPath('/na').pathname,
    },
  ];

  useEffect(() => {
    const activeTab = tabsList.find((tab) => tab.to === location.pathname);
    if (activeTab) {
      setActivePanel(activeTab.name);
    } else {
      setActivePanel(tabsList[0].name);
      navigate(`${tabsList[0].to}`);
    }
  }, [location.pathname]);

  return (
    <React.Suspense>
      {data && (
        <div>
          <DashboardLayout
            header={{ title: data.name }}
            tabs={
              <OsdsTabs panel={panel}>
                <OsdsTabBar slot="top">
                  {tabsList.map((tab: DashboardTabItemProps) => (
                    <OsdsTabBarItem
                      key={`osds-tab-bar-item-${tab.name}`}
                      panel={tab.name}
                      disabled={tab.disabled}
                      className="flex items-center justify-center"
                    >
                      <NavLink to={tab.to} className="no-underline">
                        <OsdsText
                          color={ODS_THEME_COLOR_INTENT.primary}
                          level={ODS_TEXT_LEVEL.heading}
                        >
                          {tab.title}
                        </OsdsText>
                      </NavLink>
                      {tab.badge && (
                        <OsdsChip
                          className="ml-5"
                          color={ODS_THEME_COLOR_INTENT.primary}
                        >
                          {tab.badge}
                        </OsdsChip>
                      )}
                    </OsdsTabBarItem>
                  ))}
                </OsdsTabBar>
              </OsdsTabs>
            }
            breadcrumb={<Breadcrumb items={[{ label: data?.name }]} />}
          />
          <Outlet />
        </div>
      )}
    </React.Suspense>
  );
}
