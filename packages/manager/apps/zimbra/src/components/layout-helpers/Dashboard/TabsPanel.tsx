import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { useOverridePage, useOrganization } from '@/hooks';

export type TabItemProps = {
  name: string;
  trackingName: string;
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

  const { trackClick } = useOvhTracking();
  const { data: organization } = useOrganization();

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
      {!isOverriddedPage && (
        <OdsTabs>
          {tabs.map(
            (tab: TabItemProps) =>
              !tab.hidden && (
                <NavLink
                  key={`osds-tab-bar-item-${tab.name}`}
                  to={
                    organization?.id
                      ? `${tab.to}?organizationId=${organization?.id}`
                      : tab.to
                  }
                  className="no-underline"
                  onClick={() => {
                    trackClick({
                      location: PageLocation.page,
                      buttonType: ButtonType.tab,
                      actionType: 'navigation',
                      actions: [tab.trackingName],
                    });
                  }}
                >
                  <OdsTab
                    id={tab.name}
                    role="tab"
                    isSelected={activePanel === tab.name}
                  >
                    {tab.title}
                  </OdsTab>
                </NavLink>
              ),
          )}
        </OdsTabs>
      )}
    </>
  );
};

export default TabsPanel;
