import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/text/react';
import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
} from '@ovhcloud/ods-components/tabs/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components/text';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { PageLayout } from './PageLayout';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ tabs }) => {
  const { t } = useTranslation('vrack-services/dashboard');
  const [activePanel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const activeTab = tabs.find((tab) => tab.to === location.pathname);
    if (activeTab) {
      setActivePanel(activeTab.name);
    } else {
      setActivePanel(tabs[0].name);
      navigate(`${tabs[0].to}`);
    }
  }, [location.pathname]);

  return (
    <PageLayout>
      <div className="py-4">
        <OsdsText
          className="block mb-5"
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._600}
        >
          {t('title')}
        </OsdsText>
        <OsdsText
          className="block mb-8"
          level={ODS_TEXT_LEVEL.body}
          color={ODS_THEME_COLOR_INTENT.default}
          size={ODS_TEXT_SIZE._400}
        >
          {t('description')}
        </OsdsText>
      </div>
      <OsdsTabs panel={activePanel}>
        <OsdsTabBar slot="top">
          {tabs.map((tab: DashboardTabItemProps, key: number) => (
            <OsdsTabBarItem key={`osds-tab-bar-item-${key}`} panel={tab.name}>
              <NavLink to={tab.to} className="no-underline">
                {tab.title}
              </NavLink>
            </OsdsTabBarItem>
          ))}
        </OsdsTabBar>
      </OsdsTabs>
      <Outlet />
    </PageLayout>
  );
};
