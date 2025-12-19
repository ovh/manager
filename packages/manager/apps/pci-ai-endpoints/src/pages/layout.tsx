import { Suspense, useState, useEffect, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ErrorBanner,
  BaseLayout,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import {
  Outlet,
  useRouteError,
  useParams,
  useResolvedPath,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useProject } from '@ovh-ux/manager-pci-common';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Tabs, TabList, Tab, Button, Icon, Spinner } from '@ovhcloud/ods-react';
import HidePreloader from '@/core/HidePreloader';
import ShellRoutingSync from '@/core/ShellRoutingSync';
import usePageTracking from '@/hooks/usePageTracking';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import EndpointsGuide from '@/components/Guides';
import { useGetMetrics } from '@/hooks/api/database/metric/useGetMetrics.hook';
import { TRACKING } from '@/configuration/tracking.constants';

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

const CREATE_TOKEN = 'pci-ai-endpoints:create-token';

export default function Layout() {
  const { projectId } = useParams<{ projectId: string }>();
  const { t } = useTranslation(['metric', 'token']);
  const { data } = useProject(projectId ?? '', { retry: false });
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const ROOT = `/pci/projects/${projectId}/ai/endpoints`;
  const { data: availability } = useFeatureAvailability([CREATE_TOKEN]);

  const dateParams = getDateParams();
  const metricsQuery = useGetMetrics(
    projectId,
    dateParams.startDate,
    dateParams.endDate,
  );

  const metricsPath = useResolvedPath('metrics').pathname;
  const tokenPath = useResolvedPath('token').pathname;

  const tabsList = useMemo(() => {
    const list: TabItemProps[] = [
      {
        name: 'metrics',
        title: t('metric:ai_endpoints_metrics'),
        to: metricsPath,
      },
    ];

    if (availability?.[CREATE_TOKEN]) {
      list.push({
        name: 'token',
        title: t('token:ai_endpoints_token'),
        to: tokenPath,
      });
    }

    return list;
  }, [availability, metricsPath, tokenPath, t]);

  const [activePanel, setActivePanel] = useState<string>('');
  const [titleHeader, setTitleHeader] = useState<string>('');

  useEffect(() => {
    if (pathname === ROOT) {
      return;
    }

    const findActiveTab = (tabList: TabItemProps[]) =>
      tabList.find((tab) => tab.to === pathname);
    const findActiveParentTab = (tabList: TabItemProps[]) =>
      tabList.find(
        (tab) => tab.to === pathname.slice(0, pathname.lastIndexOf('/')),
      );

    const activeTab = findActiveTab(tabsList) || findActiveParentTab(tabsList);
    if (activeTab) {
      setActivePanel(activeTab.name);
      setTitleHeader(activeTab.title);
    } else {
      setActivePanel(tabsList[0].name);
      setTitleHeader(tabsList[0].title);
      navigate(tabsList[0].to);
    }
  }, [pathname, tabsList, navigate, ROOT]);

  const headerProps: HeadersProps = {
    title: titleHeader,
    headerButton: <EndpointsGuide />,
  };
  const { trackClick } = useOvhTracking();

  usePageTracking();

  const handleTabClick = (tab: string) => {
    trackClick(TRACKING.metrics.tabClick(tab));
  };
  return (
    <div className="application">
      <Suspense
        fallback={
          <div className="flex justify-center" data-testid="loading-container">
            <Spinner className="w-16 h-16 my-20" />
          </div>
        }
      >
        <ShellRoutingSync />
        {metricsQuery.isLoading ? (
          <div className="flex justify-center">
            <Spinner className="w-16 h-16 mt-[45vh]" />
          </div>
        ) : (
          data && (
            <div className="relative animate-fade-in">
              <BaseLayout
                header={pathname !== ROOT ? headerProps : undefined}
                tabs={
                  pathname !== ROOT && (
                    <Tabs
                      value={activePanel}
                      className="-ml-2"
                      onValueChange={({ value }) => {
                        const target = tabsList.find(
                          (tab) => tab.name === value,
                        );
                        if (target) {
                          handleTabClick(target.name);
                          navigate(target.to);
                        }
                      }}
                    >
                      <TabList>
                        {tabsList.map((tab) => (
                          <Tab
                            key={tab.name}
                            value={tab.name}
                            className="m-0 cursor-pointer"
                          >
                            {tab.title}
                          </Tab>
                        ))}
                      </TabList>
                    </Tabs>
                  )
                }
                breadcrumb={<Breadcrumb />}
              />
              {pathname !== ROOT && (
                <div
                  className={`customTabs:flex self-end customTabs:-mt-[5.31rem] md:-mt-[5.56rem] ${
                    availability?.[CREATE_TOKEN]
                      ? 'customTabs:ml-[14.38rem]'
                      : 'customTabs:ml-[9rem]'
                  } customTabs:absolute`}
                >
                  <Button
                    color="primary"
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      window.open(AI_ENDPOINTS_URL, '_blank', 'noopener')
                    }
                  >
                    {AI_ENDPOINTS_LABEL}
                    <Icon
                      aria-hidden="true"
                      className="ml-1"
                      name="external-link"
                    />
                  </Button>
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
