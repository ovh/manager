import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsChip,
} from '@ovhcloud/ods-components/react';
import { Headers } from '@ovh-ux/manager-react-components';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useOverridePage, useOrganization } from '@/hooks';

export type TabItemProps = {
  name: string;
  title: string;
  pathMatchers?: RegExp[];
  to: string;
  hidden?: boolean;
};

export type TabsProps = {
  tabs: TabItemProps[];
};

const TabsPanel: React.FC<TabsProps> = ({ tabs }) => {
  const [activePanel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { data } = useOrganization();

  const isOverriddedPage = useOverridePage();
  useEffect(() => {
    if (!location.pathname) {
      setActivePanel(tabs[0].name);
      navigate(tabs[0].to);
    } else {
      const activeTab = tabs.find(
        (tab) =>
          tab.to === location.pathname ||
          tab.pathMatchers?.some((pathMatcher) =>
            pathMatcher.test(location.pathname),
          ),
      );
      if (activeTab) {
        setActivePanel(activeTab.name);
      }
    }
  }, [location.pathname]);

  return (
    <>
      {data && (
        <div className="flex items-center mb-4">
          <Headers subtitle={data.currentState.name} />
          <OsdsChip
            removable
            inline
            size={ODS_CHIP_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => navigate(location.pathname)}
            className="ml-4"
          >
            {data.currentState.label}
          </OsdsChip>
        </div>
      )}

      {!isOverriddedPage && (
        <OsdsTabBar slot="top">
          <OsdsTabs panel={activePanel}>
            {tabs.map(
              (tab: TabItemProps) =>
                !tab.hidden && (
                  <NavLink
                    key={`osds-tab-bar-item-${tab.name}`}
                    to={
                      data?.id ? `${tab.to}?organizationId=${data?.id}` : tab.to
                    }
                    className="no-underline"
                  >
                    <OsdsTabBarItem panel={tab.name}>
                      {tab.title}
                    </OsdsTabBarItem>
                  </NavLink>
                ),
            )}
          </OsdsTabs>
        </OsdsTabBar>
      )}
    </>
  );
};

export default TabsPanel;
