import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL } from '@ovhcloud/ods-components';
import {
  OsdsChip,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabs,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import React, { FC, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslate } from '@/utils/translation';
import { DashboardTabItemProps } from './Dashboard';

const TabBar: FC<{ tabs: DashboardTabItemProps[] }> = ({ tabs }) => {
  const { t } = useTranslate('pci-rancher/dashboard');

  const location = useLocation();

  const [activePanel] = useState(
    tabs.find((tab) => tab.to === location.pathname)?.name,
  );

  return (
    <OsdsTabs panel={activePanel}>
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
                {t('comingSoon')}
              </OsdsChip>
            )}
          </OsdsTabBarItem>
        ))}
      </OsdsTabBar>
    </OsdsTabs>
  );
};

export default TabBar;
