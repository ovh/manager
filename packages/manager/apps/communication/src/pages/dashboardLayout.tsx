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
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { urls } from '@/routes/routes.constant';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
};

export default function DashboardLayout() {
  const { trackClick } = useOvhTracking();
  const [panel, setActivePanel] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation('common');

  const tabsList: DashboardTabItemProps[] = [
    {
      name: 'communications',
      title: t('tab_communications'),
      to: useResolvedPath(urls.CommunicationsTab).pathname,
    },
    {
      name: 'contacts',
      title: t('tab_contacts'),
      to: useResolvedPath(urls.ContactsTab).pathname,
    },
    {
      name: 'preference-center',
      title: t('tab_settings'),
      to: useResolvedPath(urls.SettingsTab).pathname,
    },
  ];

  useEffect(() => {
    const activeTab = tabsList.find((tab) => tab.to === location.pathname);
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
                  actionType: 'navigation',
                  actions: [
                    tab.name, // chapter 2
                    tab.name, // chapter 3
                    'main-tabnav',
                    'go-to-tab',
                    tab.name,
                  ],
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
