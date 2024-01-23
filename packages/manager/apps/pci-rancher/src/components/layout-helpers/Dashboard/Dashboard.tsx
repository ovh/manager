import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsTabs,
  OsdsText,
  OsdsLink,
  OsdsIcon,
} from '@ovhcloud/ods-components/react';
import React, { useEffect, useState } from 'react';
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
  useHref,
  useParams,
} from 'react-router-dom';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { RancherService } from '@/api/api.type';
import RancherDetail from './RancherDetail';
import { COMMON_PATH } from '@/routes';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
  isDisabled?: boolean;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
  rancher: RancherService;
};

const Dashboard: React.FC<DashboardLayoutProps> = ({ tabs, rancher }) => {
  const { t } = useTranslation('pci-rancher/dashboard');
  const [panel, setActivePanel] = useState('');
  const location = useLocation();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const hrefPrevious = useHref(`../${COMMON_PATH}/${projectId}/rancher`);

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
      <div className="py-4">
        <OsdsText
          level={ODS_TEXT_LEVEL.heading}
          color={ODS_THEME_COLOR_INTENT.text}
          size={ODS_TEXT_SIZE._600}
        >
          {rancher.currentState.name}
        </OsdsText>
      </div>
      <div className="flex items-center my-6">
        <OsdsIcon
          className="mr-4"
          name={ODS_ICON_NAME.ARROW_LEFT}
          size={ODS_ICON_SIZE.xxs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
        <OsdsLink href={hrefPrevious} color={ODS_THEME_COLOR_INTENT.primary}>
          {t('see_all_rancher')}
        </OsdsLink>
      </div>
      <OsdsTabs panel={panel}>
        <OsdsTabBar slot="top">
          {tabs.map((tab: DashboardTabItemProps) => (
            <OsdsTabBarItem
              key={`osds-tab-bar-item-${tab.name}`}
              panel={tab.name}
              disabled={tab.isDisabled}
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
              {tab.isCommingSoon && (
                <OsdsChip
                  color={ODS_THEME_COLOR_INTENT.primary}
                  className="ml-5"
                >
                  {t('comming_soon')}
                </OsdsChip>
              )}
            </OsdsTabBarItem>
          ))}
        </OsdsTabBar>
      </OsdsTabs>
      <RancherDetail rancher={rancher} projectId={projectId} />
      <Outlet />
    </>
  );
};

export default Dashboard;
