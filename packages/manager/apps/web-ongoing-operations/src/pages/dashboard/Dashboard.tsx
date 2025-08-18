import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';
import { OdsTabs, OdsTab } from '@ovhcloud/ods-components/react';
import {
  BaseLayout,
  GuideButton,
  GuideItem,
  Notifications,
  useAuthorizationIam,
  useFeatureAvailability,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { GUIDES_LIST } from '@/guides.constants';
import { getLanguageKey } from '@/utils/utils';
import { urls } from '@/routes/routes.constant';
import { useGetIAMResourceAllDom } from '@/hooks/iam/iam';
import { allDomFeatureAvailibility, iamGetAllDomAction } from '@/constants';

export const DNS_OPERATIONS_TABLE_HEADER_DOMAIN = 'DNS';

export type DashboardTabItemProps = {
  name: string;
  title: string;
  to: string;
  hide?: boolean;
};

export type DashboardLayoutProps = {
  tabs: DashboardTabItemProps[];
};

export default function DashboardPage() {
  const [activePanel, setActivePanel] = useState<string>('');
  const [displayAllDom, setDisplayAllDom] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('dashboard');
  const { notifications } = useNotifications();
  const langCode = getLanguageKey(i18n.language);

  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: GUIDES_LIST.domains.url[langCode],
      target: '_blank',
      label: t('domain_operations_guides'),
    },
  ];
  const { data: allDomIAMRessources } = useGetIAMResourceAllDom();
  const urn = allDomIAMRessources?.[0]?.urn;
  const { isAuthorized = false } = useAuthorizationIam(
    [iamGetAllDomAction],
    urn,
  );
  const { data: availability } = useFeatureAvailability([
    allDomFeatureAvailibility,
  ]);

  const tabsList: DashboardTabItemProps[] = [
    {
      name: 'domain',
      title: t('domain_operations_table_header_domain'),
      to: useResolvedPath(urls.domain).pathname,
    },
    {
      name: 'dns',
      title: DNS_OPERATIONS_TABLE_HEADER_DOMAIN,
      to: useResolvedPath(urls.dns).pathname,
    },
    {
      name: 'allDom',
      title: t('domain_operations_table_header_allDom'),
      to: useResolvedPath(urls.allDom).pathname,
      hide: displayAllDom,
    },
  ];

  useEffect(() => {
    if (availability) {
      if (isAuthorized && availability[allDomFeatureAvailibility] === true) {
        setDisplayAllDom(false);
      } else {
        setDisplayAllDom(true);
      }
    }
  }, [urn, availability, isAuthorized]);

  useEffect(() => {
    const activeTab = tabsList.find((tab) => tab.to === location.pathname);
    if (activeTab) {
      setActivePanel(activeTab.name);
      return;
    }
    setActivePanel(tabsList[0].name);
    navigate(`${tabsList[0].to}`);
  }, [location.pathname]);

  return (
    <BaseLayout
      header={{
        title: t('domain_operations_dashboard_title'),
        headerButton: <GuideButton items={guideItems} />,
      }}
      description={t('domain_operations_dashboard_info')}
      tabs={
        <OdsTabs>
          {tabsList.map((tab: DashboardTabItemProps) => {
            if (tab.hide) return <></>;
            return (
              <NavLink
                key={`osds-tab-bar-item-${tab.name}`}
                to={tab.to}
                className="no-underline"
              >
                <OdsTab
                  id={tab.name}
                  role="tab"
                  isSelected={activePanel === tab.name}
                >
                  {tab.title}
                </OdsTab>
              </NavLink>
            );
          })}
        </OdsTabs>
      }
      message={notifications.length ? <Notifications /> : null}
    >
      <Outlet />
    </BaseLayout>
  );
}
