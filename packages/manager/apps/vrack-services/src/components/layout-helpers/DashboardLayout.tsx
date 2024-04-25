import React from 'react';
import {
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import {
  OsdsTabs,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { PageLayout } from './PageLayout';
import { OperationMessages } from '../OperationMessages';
import { DashboardTabItemProps } from './layout-helpers.type';
import { UpdateDisplayNameMessage } from '../UpdateDisplayName/UpdateDisplayNameMessages';

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ tabs }) => {
  const { t } = useTranslation('vrack-services/dashboard');
  const { id } = useParams();
  const [activePanel, setActivePanel] = React.useState('');
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (location.pathname === '') {
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
        <OperationMessages id={id} />
      </div>
      <UpdateDisplayNameMessage vrackServicesId={id} />
      <OsdsTabs panel={activePanel}>
        <OsdsTabBar slot="top">
          {tabs.map((tab: DashboardTabItemProps) => (
            <NavLink
              to={tab.to}
              className="no-underline"
              key={`osds-tab-bar-item-${tab.name}`}
              onClick={tab.onClick}
            >
              <OsdsTabBarItem panel={tab.name}>{tab.title}</OsdsTabBarItem>
            </NavLink>
          ))}
        </OsdsTabBar>
      </OsdsTabs>
      <Outlet />
    </PageLayout>
  );
};
