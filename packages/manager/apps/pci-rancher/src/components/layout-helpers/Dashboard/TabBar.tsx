import {
  OsdsChip,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabs,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import React, { FC, useEffect, useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { DashboardTabItemProps } from './Dashboard';

const TabBar: FC<{ tabs: DashboardTabItemProps[] }> = ({ tabs }) => {
  const { t } = useTranslation('pci-rancher/dashboard');

  const [panel, setActivePanel] = useState('');
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
    <OsdsTabs panel={panel}>
      <OsdsTabBar slot="top">
        {tabs.map((tab: DashboardTabItemProps) => (
          <OsdsTabBarItem
            key={`osds-tab-bar-item-${tab.name}`}
            panel={tab.name}
            disabled={tab.isDisabled || undefined}
            className="flex items-center justify-center"
          >
            {!tab.isDisabled ? (
              <NavLink to={tab.to} className="no-underline">
                <OsdsText
                  color={ODS_THEME_COLOR_INTENT.primary}
                  level={ODS_TEXT_LEVEL.heading}
                >
                  {tab.title}
                </OsdsText>
              </NavLink>
            ) : (
              <OsdsText
                level={ODS_TEXT_LEVEL.heading}
                color={ODS_THEME_COLOR_INTENT.primary}
              >
                {tab.title}
              </OsdsText>
            )}
            {tab.isComingSoon && (
              <OsdsChip color={ODS_THEME_COLOR_INTENT.primary} className="ml-5">
                {t('commingSoon')}
              </OsdsChip>
            )}
          </OsdsTabBarItem>
        ))}
      </OsdsTabBar>
    </OsdsTabs>
  );
};

export default TabBar;
