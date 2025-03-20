import React from 'react';
import {
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { OdsTabs, OdsTab, OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { ChangelogButton } from '@ovh-ux/manager-react-components';
import { PageLayout } from './PageLayout.component';
import { DashboardTabItemProps } from './layout-helpers.type';
import { OperationMessages } from '../feedback-messages/OperationMessages.component';
import { SuccessMessages } from '../feedback-messages/SuccessMessage.component';
import { CHANGELOG_LINKS } from '@/utils/constants';

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
        <div className="flex items-center justify-between">
          <OdsText className="block mb-5" preset={ODS_TEXT_PRESET.heading4}>
            {t('dashboardPageTitle')}
          </OdsText>
          <ChangelogButton links={CHANGELOG_LINKS} />
        </div>

        <OdsText className="block mb-8" preset={ODS_TEXT_PRESET.paragraph}>
          {t('dashboardPageDescription')}
        </OdsText>
        <OperationMessages id={id} />
        <SuccessMessages id={id} />
      </div>
      <OdsTabs>
        {tabs.map((tab: DashboardTabItemProps) => (
          <OdsTab
            key={`osds-tab-${tab.name}`}
            isSelected={activePanel === tab.name}
          >
            <NavLink to={tab.to} className="no-underline" onClick={tab.onClick}>
              {tab.title}
            </NavLink>
          </OdsTab>
        ))}
      </OdsTabs>
      <Outlet />
    </PageLayout>
  );
};
