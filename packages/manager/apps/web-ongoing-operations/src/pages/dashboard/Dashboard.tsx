import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  NavLink,
  useLocation,
  useNavigate,
  useResolvedPath,
} from 'react-router-dom';
import {
  BaseLayout,
  GuideButton,
  GuideItem,
  Notifications,
  useAuthorizationIam,
  useFeatureAvailability,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { Tab, TabList, Tabs, TabsValueChangeEvent } from '@ovhcloud/ods-react';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { GUIDES_LIST } from '@/guides.constants';
import { getLanguageKey } from '@/utils/utils';
import { urls } from '@/routes/routes.constant';
import { useGetIAMResourceAllDom } from '@/hooks/iam/iam';
import { allDomFeatureAvailibility, iamGetAllDomAction } from '@/constants';
import { useTrackNavigation } from '@/hooks/tracking/useTrackDatagridNavivationLink';

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
  const {
    trackPageNavivationTab,
    trackTileNavivationLink,
  } = useTrackNavigation();

  const [displayAllDom, setDisplayAllDom] = useState<boolean>(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(['dashboard', NAMESPACES.DASHBOARD]);
  const { notifications } = useNotifications();
  const langCode = getLanguageKey(i18n.language);
  const [value, setValue] = useState('domain');

  const guideItems: GuideItem[] = [
    {
      id: 1,
      href: GUIDES_LIST.domains.url[langCode],
      target: '_blank',
      label: t(`${NAMESPACES.DASHBOARD}:general_information`),
      onClick: () => {
        trackTileNavivationLink(GUIDES_LIST.domains.url[langCode]);
      },
    },
  ];
  const { data: allDomIAMRessources } = useGetIAMResourceAllDom();
  const urn = allDomIAMRessources?.[0]?.urn ?? '';
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
      name: 'alldom',
      title: t('domain_operations_table_header_allDom'),
      to: useResolvedPath(urls.allDom).pathname,
      hide: !displayAllDom,
    },
  ];

  const handleValueChange = async (event: TabsValueChangeEvent) => {
    navigate(`${event.value}`, { replace: true });
    setValue(event.value);
  };

  useEffect(() => {
    if (availability) {
      if (isAuthorized && availability[allDomFeatureAvailibility] === true) {
        setDisplayAllDom(true);
      } else {
        setDisplayAllDom(false);
      }
    }
  }, [urn, availability, isAuthorized]);

  useEffect(() => {
    const tab =
      tabsList.find((tabName) =>
        location.pathname.endsWith(tabName.name),
      )?.name || 'domain';
    if (location.pathname) {
      handleValueChange({ value: tab })
    }
  }, [location.pathname]);

  return (
    <BaseLayout
      header={{
        title: t('domain_operations_dashboard_title'),
        headerButton: <GuideButton items={guideItems} />,
      }}
      description={t('domain_operations_dashboard_info')}
      tabs={
        <Tabs defaultValue={value} onValueChange={handleValueChange} value={value}>
          <TabList>
            {tabsList
              .filter((tab: DashboardTabItemProps) => !tab.hide)
              .map((tab: DashboardTabItemProps) => {
                return (
                  <NavLink
                    key={`osds-tab-bar-item-${tab.name}`}
                    to={tab.to}
                    className="no-underline"
                    onClick={() => {
                      trackPageNavivationTab(tab.to);
                    }}
                  >
                    <Tab id={tab.name} role="tab" value={tab.name}>
                      {tab.title}
                    </Tab>
                  </NavLink>
                );
              })}
          </TabList>
        </Tabs>
      }
      message={notifications.length ? <Notifications /> : undefined}
    >
      <Outlet />
    </BaseLayout>
  );
}
