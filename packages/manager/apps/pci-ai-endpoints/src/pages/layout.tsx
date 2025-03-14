import { Suspense, useState, useEffect, useMemo, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorBanner, BaseLayout } from '@ovh-ux/manager-react-components';
import {
  Outlet,
  useRouteError,
  useParams,
  NavLink,
  useResolvedPath,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useProject } from '@ovh-ux/manager-pci-common';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  OsdsTabs,
  OsdsIcon,
  OsdsTabBar,
  OsdsTabBarItem,
  OsdsButton,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_SIZE,
  ODS_ICON_SIZE,
  ODS_ICON_NAME,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OdsHTMLAnchorElementTarget } from '@ovhcloud/ods-common-core';
import clsx from 'clsx';
import HidePreloader from '@/core/HidePreloader';
import ShellRoutingSync from '@/core/ShellRoutingSync';
import usePageTracking from '@/hooks/usePageTracking';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import EndpointsGuide from '@/components/Guides';
import { useGetMetrics } from '@/hooks/api/database/metric/useGetMetrics.hook';

export type TabItemProps = {
  name: string;
  title: string;
  to: string;
};

export interface HeadersProps {
  title: string;
  headerButton: React.ReactElement;
}

const AI_ENDPOINTS_LABEL = 'AI Endpoints';
const AI_ENDPOINTS_URL = 'https://endpoints.ai.cloud.ovh.net/';

const getDateParams = () => {
  const startDate = encodeURIComponent(
    new Date(new Date().getFullYear(), 0, 1).toISOString(),
  );
  const endDate = encodeURIComponent(
    new Date(
      new Date().getFullYear(),
      new Date().getMonth() + 1,
      0,
    ).toISOString(),
  );
  return { startDate, endDate };
};

export default function Layout() {
  const { projectId } = useParams<{ projectId: string }>();
  const { t } = useTranslation('metric');
  const { data } = useProject(projectId ?? '', { retry: false });
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const ROOT = `/pci/projects/${projectId}/ai/endpoints`;

  const dateParams = getDateParams();
  const metricsQuery = useGetMetrics(
    projectId,
    dateParams.startDate,
    dateParams.endDate,
  );

  const tabsList: TabItemProps[] = [
    {
      name: 'metrics',
      title: t('ai_endpoints_metrics'),
      to: useResolvedPath('metrics').pathname,
    },
  ];

  const [panel, setActivePanel] = useState<string>('');
  const [titleHeader, setTitleHeader] = useState<string>('');

  const { visibleTabs, activeTab } = useMemo(() => {
    const findActiveTab = (tabList: TabItemProps[]) =>
      tabList.find((tab) => tab.to === pathname) ||
      tabList.find(
        (tab) => tab.to === pathname.slice(0, pathname.lastIndexOf('/')),
      );

    return {
      visibleTabs: tabsList,
      activeTab: findActiveTab(tabsList) ?? tabsList[0],
    };
  }, [pathname, tabsList]);

  useEffect(() => {
    if (!activeTab && visibleTabs.length > 0) {
      navigate(visibleTabs[0].to);
    }
  }, [activeTab, visibleTabs, navigate]);

  useEffect(() => {
    if (activeTab) {
      setActivePanel(activeTab.name);
      setTitleHeader(activeTab.title);
    }
  }, [activeTab]);

  const headerProps: HeadersProps = {
    title: titleHeader,
    headerButton: <EndpointsGuide />,
  };

  usePageTracking();

  return (
    <div className="application">
      <Suspense
        fallback={
          <div className="flex justify-center" data-testid="loading-container">
            <OsdsSpinner className="w-16 h-16 my-20" />
          </div>
        }
      >
        <ShellRoutingSync />
        {metricsQuery.isLoading ? (
          <div className="flex justify-center">
            <OsdsSpinner className="w-16 h-16 mt-[45vh]" />
          </div>
        ) : (
          data && (
            <div className="relative animate-fade-in">
              <BaseLayout
                header={pathname !== ROOT && headerProps}
                tabs={
                  pathname !== ROOT && (
                    <OsdsTabs panel={panel} className="-ml-2">
                      <OsdsTabBar slot="top">
                        {visibleTabs.map((tab) => (
                          <NavLink
                            to={tab.to}
                            key={tab.name}
                            className={({ isActive }) =>
                              clsx('no-underline', {
                                'selected-tab-class': isActive,
                              })
                            }
                          >
                            <OsdsTabBarItem
                              panel={tab.name}
                              active={tab.name === panel}
                            >
                              {tab.title}
                            </OsdsTabBarItem>
                          </NavLink>
                        ))}
                      </OsdsTabBar>
                    </OsdsTabs>
                  )
                }
                breadcrumb={<Breadcrumb />}
              />
              {pathname !== ROOT && (
                <div className="customTabs:flex self-end customTabs:-mt-[85px] md:-mt-[89px] customTabs:ml-[170px] customTabs:absolute">
                  <OsdsButton
                    inline
                    color={ODS_THEME_COLOR_INTENT.primary}
                    size={ODS_BUTTON_SIZE.sm}
                    variant={ODS_BUTTON_VARIANT.ghost}
                    href={AI_ENDPOINTS_URL}
                    target={OdsHTMLAnchorElementTarget._blank}
                  >
                    {AI_ENDPOINTS_LABEL}
                    <span slot="end">
                      <OsdsIcon
                        aria-hidden="true"
                        className="ml-1"
                        name={ODS_ICON_NAME.EXTERNAL_LINK}
                        hoverable
                        size={ODS_ICON_SIZE.xxs}
                        color={ODS_THEME_COLOR_INTENT.primary}
                      />
                    </span>
                  </OsdsButton>
                </div>
              )}
              <div className="py-8 px-4 md:pb-9 md:pt-0 md:px-10">
                <Outlet />
              </div>
            </div>
          )
        )}
        <HidePreloader />
      </Suspense>
    </div>
  );
}

export const ErrorBoundary = () => {
  const error = useRouteError() as ApiError;
  const { navigation } = useContext(ShellContext).shell;

  return (
    <Suspense>
      <ErrorBanner
        onReloadPage={() => navigation.reload()}
        onRedirectHome={() => navigation.navigateTo('public-cloud', '', {})}
        error={{
          data: { message: error.response?.data?.message || error.message },
          headers: error.response?.headers || {},
        }}
      />
      <ShellRoutingSync />
      <HidePreloader />
    </Suspense>
  );
};
