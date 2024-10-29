import { useProject } from '@ovh-ux/manager-pci-common';
import {
  Headers,
  PciGuidesHeader,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { OsdsBreadcrumb, OsdsChip } from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Outlet,
  useHref,
  useLocation,
  useParams,
  useResolvedPath,
} from 'react-router-dom';
import TabsPanel from '@/components/detail/TabsPanel.component';
import { useKubeDetail } from '@/api/hooks/useKubernetes';
import { TRACKING_TABS } from '@/tracking.constants';
import { useAppStore } from '@/store';
import { REFETCH_INTERVAL_DURATION } from '@/helpers';

export default function DetailPage() {
  const { t } = useTranslation('listing');
  const { t: tDetail } = useTranslation('detail');
  const [activePanelTranslation, setActivePanelTranslation] = useState(null);

  const { region } = useAppStore();
  const { data: project } = useProject();
  const { projectId, kubeId } = useParams();
  const hrefProject = useProjectUrl('public-cloud');
  const hrefBack = useHref('..');
  const hrefService = useHref('./service');
  const location = useLocation();

  const tabs = [
    {
      name: 'kube_service',
      title: tDetail('kube_service'),
      to: useResolvedPath('service').pathname,
      tracking: TRACKING_TABS.SERVICE,
    },
    {
      name: 'kube_node_pools',
      title: tDetail('kube_node_pools'),
      to: useResolvedPath('nodepools').pathname,
      tracking: TRACKING_TABS.NODE_POOL,
    },
    {
      name: 'kube_restrictions',
      title: tDetail('kube_restrictions'),
      to: useResolvedPath('restrictions').pathname,
      tracking: TRACKING_TABS.API_SERVER,
    },
    {
      name: 'kube_logs_tab_title',
      title: (
        <span>
          {tDetail('kube_logs_tab_title')}
          <OsdsChip
            className="ml-4"
            color={ODS_THEME_COLOR_INTENT.success}
            size={ODS_CHIP_SIZE.sm}
            inline
          >
            {tDetail('kube_logs_tab_title_beta_status')}
          </OsdsChip>
        </span>
      ),
      to: useResolvedPath('logs').pathname,
      tracking: TRACKING_TABS.LOGS,
      isHidden: region === 'US',
    },
  ];

  const { data: kubeDetail } = useKubeDetail(
    projectId,
    kubeId,
    REFETCH_INTERVAL_DURATION,
  );

  useEffect(() => {
    const activeTab = tabs.find((tab) => location.pathname.startsWith(tab.to));
    setActivePanelTranslation(tDetail(activeTab?.name));
  }, [location.pathname]);

  return (
    <>
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: hrefProject,
              label: project.description,
            },
            {
              label: t('kube_list_title'),
              href: hrefBack,
            },
            {
              label: kubeDetail?.name,
              href: hrefService,
            },
            { label: activePanelTranslation },
          ]}
        />
      )}
      <div className="header mt-8">
        <Headers
          title={kubeDetail?.name}
          headerButton={
            <div className="min-w-[7rem]">
              <PciGuidesHeader category="kubernetes" />
            </div>
          }
        />
      </div>

      <div className="mb-8">
        <TabsPanel tabs={tabs} />
      </div>

      <Outlet />
    </>
  );
}
