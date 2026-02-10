import { useEffect, useState } from 'react';

import { Outlet, useHref, useLocation, useParams, useResolvedPath } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsBreadcrumb, OsdsSpinner } from '@ovhcloud/ods-components/react';

import { useProject } from '@ovh-ux/manager-pci-common';
import {
  Headers,
  Notifications,
  useFeatureAvailability,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';

import { useLoadBalancer } from '@/api/hook/useLoadBalancer';
import TabsPanel, { TabsProps } from '@/components/detail/TabsPanel.component';
import { LOGS_FEATURE_AVAILABILITY_KEY } from '@/constants';
import { ROUTE_PATHS } from '@/routes';

export default function DetailPage() {
  const { t } = useTranslation('load-balancer');
  const [activePanelTranslation, setActivePanelTranslation] = useState<string | null>(null);

  const location = useLocation();
  const { data: project } = useProject();
  const { projectId, region, loadBalancerId } = useParams<{
    projectId: string;
    region: string;
    loadBalancerId: string;
  }>();

  const hrefProject = useProjectUrl('public-cloud');
  const hrefBack = useHref('..');
  const hrefGeneralInformation = useHref(ROUTE_PATHS.GENERAL_INFORMATION);
  const logsPath = useResolvedPath(ROUTE_PATHS.LOGS).pathname;

  const { data: availability } = useFeatureAvailability([LOGS_FEATURE_AVAILABILITY_KEY]);

  const tabs: TabsProps['tabs'] = [
    {
      name: 'octavia_load_balancer_info_tab_title',
      title: t('octavia_load_balancer_info_tab_title'),
      to: useResolvedPath(ROUTE_PATHS.GENERAL_INFORMATION).pathname,
    },
    {
      name: 'octavia_load_balancer_listeners_tab_title',
      title: t('octavia_load_balancer_listeners_tab_title'),
      to: useResolvedPath(ROUTE_PATHS.LISTENERS).pathname,
    },
    {
      name: 'octavia_load_balancer_pools_tab_title',
      title: t('octavia_load_balancer_pools_tab_title'),
      to: useResolvedPath(ROUTE_PATHS.POOLS).pathname,
    },
    {
      name: 'octavia_load_balancer_statistics_tab_title',
      title: t('octavia_load_balancer_statistics_tab_title'),
      isDisabled: true,
    },
    {
      name: 'octavia_load_balancer_certificates_tab_title',
      title: t('octavia_load_balancer_certificates_tab_title'),
      isDisabled: true,
    },
  ];

  if (availability?.[LOGS_FEATURE_AVAILABILITY_KEY]) {
    tabs.push({
      name: 'octavia_load_balancer_logs_tab_title',
      title: t('octavia_load_balancer_logs_tab_title'),
      to: logsPath,
    });
  }

  const {
    data: loadBalancerDetail,
    isPending,
    error,
  } = useLoadBalancer({
    projectId,
    region,
    loadBalancerId,
  });

  useEffect(() => {
    const activeTab = tabs.find((tab) => location.pathname.startsWith(tab.to));
    setActivePanelTranslation(t(activeTab?.name));
  }, [location.pathname]);

  if (isPending && !error) {
    return <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <>
      <OsdsBreadcrumb
        items={[
          {
            href: hrefProject,
            label: project.description,
          },
          {
            label: t('octavia_load_balancers'),
            href: hrefBack,
          },
          {
            label: loadBalancerDetail?.id,
            href: hrefGeneralInformation,
          },
          { label: activePanelTranslation ?? '' },
        ]}
      />

      <div className="header mt-8 mb-4">
        <Headers title={loadBalancerDetail?.name} />
        <Notifications />
      </div>

      <div className="mb-8">
        <TabsPanel tabs={tabs} />
      </div>

      <Outlet />
    </>
  );
}
