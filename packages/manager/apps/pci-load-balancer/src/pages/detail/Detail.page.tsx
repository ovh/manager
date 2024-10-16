import { useProject } from '@ovh-ux/manager-pci-common';
import { Headers, useProjectUrl } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsBreadcrumb,
  OsdsChip,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useHref,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes';
import { useLoadBalancer } from '@/api/hook/useLoadBalancer';
import TabsPanel from '@/components/detail/TabsPanel.component';

export default function DetailPage() {
  const { t } = useTranslation('load-balancer');
  const [activePanelTranslation, setActivePanelTranslation] = useState(null);

  const location = useLocation();
  const { data: project } = useProject();
  const { projectId, region, loadBalancerId } = useParams();

  const hrefProject = useProjectUrl('public-cloud');
  const hrefBack = useHref('..');
  const hrefGeneralInformation = useHref(ROUTE_PATHS.GENERAL_INFORMATION);

  const tabs = [
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
    {
      name: 'octavia_load_balancer_logs_tab_title',
      title: (
        <span>
          {t('octavia_load_balancer_logs_tab_title')}
          <OsdsChip
            className="ml-4"
            color={ODS_THEME_COLOR_INTENT.success}
            size={ODS_CHIP_SIZE.sm}
            inline
          >
            {t('octavia_load_balancer_logs_tab_title_beta_status')}
          </OsdsChip>
        </span>
      ),
      to: useResolvedPath(ROUTE_PATHS.LOGS).pathname,
    },
  ];

  const { data: loadBalancerDetail, isPending, error } = useLoadBalancer({
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
          { label: activePanelTranslation },
        ]}
      />

      <div className="header mt-8 mb-4">
        <Headers title={loadBalancerDetail?.name} />
      </div>

      <div className="mb-8">
        <TabsPanel tabs={tabs} />
      </div>

      <Outlet />
    </>
  );
}
