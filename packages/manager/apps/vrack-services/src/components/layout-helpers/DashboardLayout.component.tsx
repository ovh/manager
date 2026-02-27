import React from 'react';

import { NavLink, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Tab, TabList, Tabs } from '@ovhcloud/ods-react';

import { BaseLayout, ChangelogMenu } from '@ovh-ux/muk';

import { CHANGELOG_LINKS, TRANSLATION_NAMESPACES } from '@/utils/constants';

import { Breadcrumb } from '../Breadcrumb.component';
import { OperationMessages } from '../feedback-messages/OperationMessages.component';
import { SuccessMessages } from '../feedback-messages/SuccessMessages.component';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
  pathMatchers?: RegExp[];
  onClick?: () => void;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ tabs }) => {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.dashboard);
  const { id } = useParams();
  const [activePanel, setActivePanel] = React.useState('');
  const location = useLocation();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (location.pathname === '' && tabs.length && tabs[0]) {
      setActivePanel(tabs[0].name);
      navigate(tabs[0].to);
    } else {
      const activeTab = tabs.find(
        (tab) =>
          tab.to === location.pathname ||
          tab.pathMatchers?.some((pathMatcher) => pathMatcher.test(location.pathname)),
      );
      if (activeTab) {
        setActivePanel(activeTab.name);
      }
    }
  }, [location.pathname, navigate, tabs]);

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{
        title: t('dashboardPageTitle'),
        changelogButton: <ChangelogMenu links={CHANGELOG_LINKS} />,
      }}
      description={t('dashboardPageDescription')}
      message={
        <>
          <OperationMessages id={id} />
          <SuccessMessages id={id} />
        </>
      }
      tabs={
        <Tabs value={activePanel}>
          <TabList>
            {tabs.map((tab: DashboardTabItemProps) => (
              <Tab value={tab.name} key={`osds-tab-${tab.name}`}>
                <NavLink to={tab.to} className="no-underline" onClick={tab.onClick}>
                  {tab.title}
                </NavLink>
              </Tab>
            ))}
          </TabList>
        </Tabs>
      }
    >
      <Outlet />
    </BaseLayout>
  );
};
