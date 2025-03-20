import React from 'react';
import {
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { BaseLayout, ChangelogButton } from '@ovh-ux/manager-react-components';
import { DashboardTabItemProps } from './layout-helpers.type';
import { OperationMessages } from '../feedback-messages/OperationMessages.component';
import { SuccessMessages } from '../feedback-messages/SuccessMessage.component';
import { CHANGELOG_LINKS } from '@/utils/constants';
import { Breadcrumb } from '../Breadcrumb.component';

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
    <BaseLayout
      breadcrumb={<Breadcrumb />}
      header={{
        title: t('dashboardPageTitle'),
        changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
      }}
      description={t('dashboardPageDescription')}
      message={
        <>
          <OperationMessages id={id} />
          <SuccessMessages id={id} />
        </>
      }
      tabs={
        <OdsTabs>
          {tabs.map((tab: DashboardTabItemProps) => (
            <OdsTab
              key={`osds-tab-${tab.name}`}
              isSelected={activePanel === tab.name}
            >
              <NavLink
                to={tab.to}
                className="no-underline"
                onClick={tab.onClick}
              >
                {tab.title}
              </NavLink>
            </OdsTab>
          ))}
        </OdsTabs>
      }
    >
      <Outlet />
    </BaseLayout>
  );
};
