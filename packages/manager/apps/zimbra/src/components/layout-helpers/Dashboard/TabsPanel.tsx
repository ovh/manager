import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsChip,
} from '@ovhcloud/ods-components/react';
import { Headers } from '@ovhcloud/manager-components';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { useQuery } from '@tanstack/react-query';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { usePlatform } from '@/hooks';
import {
  getZimbraPlatformOrganizationDetails,
  getZimbraPlatformOrganizationDetailsQueryKey,
} from '@/api';
import { urls } from '@/routes/routes.constants';

export type TabItemProps = {
  name: string;
  title: string;
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
  const { platformId } = usePlatform();

  const params = new URLSearchParams(location.search);
  const selectedOrganizationId = params.get('organizationId');
  const { data } = useQuery({
    queryKey: platformId
      ? getZimbraPlatformOrganizationDetailsQueryKey(
          platformId,
          selectedOrganizationId,
        )
      : null,
    queryFn: () =>
      platformId
        ? getZimbraPlatformOrganizationDetails(
            platformId,
            selectedOrganizationId,
          )
        : null,
    enabled: !!selectedOrganizationId && !!platformId,
  });
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
    <>
      {data && (
        <div className="flex items-center mb-4">
          <Headers subtitle={data.targetSpec.name} />
          <OsdsChip
            removable
            inline
            size={ODS_CHIP_SIZE.sm}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => navigate(urls.returnOrganizations)}
            className="ml-4"
          >
            {data.targetSpec.label}
          </OsdsChip>
        </div>
      )}

      <OsdsTabBar slot="top">
        <OsdsTabs panel={activePanel}>
          {tabs.map(
            (tab: TabItemProps) =>
              !tab.hidden && (
                <NavLink
                  key={`osds-tab-bar-item-${tab.name}`}
                  to={
                    selectedOrganizationId
                      ? `${tab.to}?organizationId=${selectedOrganizationId}`
                      : tab.to
                  }
                  className="no-underline"
                >
                  <OsdsTabBarItem panel={tab.name}>{tab.title}</OsdsTabBarItem>
                </NavLink>
              ),
          )}
        </OsdsTabs>
      </OsdsTabBar>
    </>
  );
};

export default TabsPanel;
