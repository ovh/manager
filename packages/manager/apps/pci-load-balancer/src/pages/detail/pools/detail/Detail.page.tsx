import { useProject } from '@ovh-ux/manager-pci-common';
import {
  Headers,
  Links,
  LinkType,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { OsdsBreadcrumb, OsdsSpinner } from '@ovhcloud/ods-components/react';
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
import TabsPanel from '@/components/detail/TabsPanel.component';
import { useGetPool } from '@/api/hook/usePool';

export default function PoolDetailPage() {
  const { t: tCommon } = useTranslation('pci-common');
  const { t: tLoadBalancer } = useTranslation('octavia-load-balancer');
  const { t: tPools } = useTranslation('octavia-load-balancer-pools');
  const { t: tPoolsDetail } = useTranslation('load-balancer-pools-detail');

  const [activePanelTranslation, setActivePanelTranslation] = useState(null);

  const location = useLocation();
  const { data: project } = useProject();
  const { projectId, region, loadBalancerId, poolId } = useParams();

  const hrefProject = useProjectUrl('public-cloud');
  const hrefLoadBalancers = useHref('..');
  const hrefLoadBalancerDetail = useHref(
    `../${region}/${loadBalancerId}/${ROUTE_PATHS.GENERAL_INFORMATION}`,
  );
  const hrefPools = useHref(
    `../${region}/${loadBalancerId}/${ROUTE_PATHS.POOLS}`,
  );

  const tabs = [
    {
      name: 'load_balancer_pools_detail_info_tab_title',
      title: tPoolsDetail('load_balancer_pools_detail_info_tab_title'),
      to: useResolvedPath(ROUTE_PATHS.GENERAL_INFORMATION).pathname,
    },
    {
      name: 'load_balancer_pools_detail_health_monitor_tab_title',
      title: tPoolsDetail(
        'load_balancer_pools_detail_health_monitor_tab_title',
      ),
      to: null,
    },
    {
      name: 'load_balancer_pools_detail_members_tab_title',
      title: tPoolsDetail('load_balancer_pools_detail_members_tab_title'),
      to: useResolvedPath(ROUTE_PATHS.POOL_MEMBERS).pathname,
    },
  ];

  const { data: poolDetail, isPending, error } = useGetPool({
    projectId,
    region,
    poolId,
  });

  useEffect(() => {
    const activeTab = tabs.find((tab) => location.pathname.startsWith(tab.to));
    setActivePanelTranslation(tPoolsDetail(activeTab?.name));
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
            label: tLoadBalancer('octavia_load_balancers'),
            href: hrefLoadBalancers,
          },
          {
            label: loadBalancerId,
            href: hrefLoadBalancerDetail,
          },
          {
            label: tPools('octavia_load_balancer_pools_title'),
            href: hrefPools,
          },

          { label: poolDetail?.name },
          { label: activePanelTranslation },
        ]}
      />

      <div className="header mt-8 mb-4">
        <Headers title={poolDetail?.name} />
      </div>

      <Links
        label={`${tCommon('common_back_button_back_to')} "${tPoolsDetail(
          'load_balancer_pools_detail_previous_page_label',
        )}"`}
        type={LinkType.back}
        className="mb-10"
        href={hrefPools}
      />

      <div className="mb-8">
        <TabsPanel tabs={tabs} />
      </div>

      <Outlet />
    </>
  );
}
