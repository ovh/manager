import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import { Breadcrumb, BaseLayout } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { urls } from '@/routes/routes.constant';
import { useTracking } from '@/hooks/useTracking/useTracking';
import { TrackingSubApps } from '@/tracking.constant';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export default function DashboardLayout() {
  const { trackClick } = useTracking();
  const [panel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const tabsList: DashboardTabItemProps[] = [
    {
      name: 'communications',
      title: t('tab_communications'),
      to: useResolvedPath(urls.communication.listing).pathname,
    },
    {
      name: 'contacts',
      title: t('tab_contacts'),
      to: useResolvedPath(urls.contact.listing).pathname,
    },
    {
      name: 'rules-parameter',
      title: t('tab_settings'),
      to: useResolvedPath(urls.routing.listing).pathname,
    },
  ];

  useEffect(() => {
    const matchesPath = (path: string, tabPath: string): boolean => {
      if (tabPath === '/') {
        return path === '/';
      }
      return path === tabPath || path.startsWith(`${tabPath}/`);
    };

    const activeTab = tabsList.find((tab) =>
      matchesPath(location.pathname, tab.to),
    );
    if (activeTab) {
      setActivePanel(activeTab.name);
    } else {
      setActivePanel(tabsList[0].name);
    }
  }, [location.pathname]);

  const header = {
    title: t('title'),
  };

  return (
    <BaseLayout
      breadcrumb={<Breadcrumb rootLabel={t('title')} appName="communication" />}
      header={header}
      tabs={
        <OdsTabs>
          {tabsList.map((tab: DashboardTabItemProps) => (
            <OdsTab
              key={`osds-tab-bar-item-${tab.name}`}
              className="select-none"
              isSelected={tab.name === panel}
              onOdsTabSelected={() => {
                trackClick({
                  location: PageLocation.mainTabnav,
                  actionType: 'navigation',
                  buttonType: ButtonType.tab,
                  actions: [tab.name],
                  subApp:
                    TrackingSubApps[tab.name as keyof typeof TrackingSubApps],
                });
                navigate(tab.to);
              }}
            >
              {tab.title}
            </OdsTab>
          ))}
        </OdsTabs>
      }
    >
      <Outlet />
    </BaseLayout>
  );
}
