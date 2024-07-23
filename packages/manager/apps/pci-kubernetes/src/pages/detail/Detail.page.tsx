import { useProject } from '@ovh-ux/manager-pci-common';
import {
  Headers,
  PciGuidesHeader,
  useProjectUrl,
} from '@ovhcloud/manager-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_CHIP_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsBreadcrumb,
  OsdsChip,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { Outlet, useHref, useParams, useResolvedPath } from 'react-router-dom';
import TabsPanel from '@/components/detail/TabsPanel.component';
import { useKubeDetail } from '@/api/hooks/useKubernetes';

export default function DetailPage() {
  const { t } = useTranslation('listing');
  const { t: tDetail } = useTranslation('detail');

  const { data: project } = useProject();
  const { projectId, kubeId } = useParams();
  const hrefProject = useProjectUrl(projectId);
  const hrefBack = useHref('..');

  const tabs = [
    {
      name: 'kube_service',
      title: tDetail('kube_service'),
      to: useResolvedPath('service').pathname,
    },
    {
      name: 'kube_node_pools',
      title: tDetail('kube_node_pools'),
      to: useResolvedPath('nodepools').pathname,
    },
    {
      name: 'kube_restrictions',
      title: tDetail('kube_restrictions'),
      to: useResolvedPath('restrictions').pathname,
    },
    {
      name: 'kube_logs',
      title: (
        <>
          {tDetail('kube_logs_tab_title')}
          <OsdsChip
            className="ml-4"
            color={ODS_THEME_COLOR_INTENT.success}
            size={ODS_CHIP_SIZE.sm}
            inline
          >
            <OsdsText
              color={ODS_THEME_COLOR_INTENT.text}
              level={ODS_TEXT_LEVEL.body}
              size={ODS_TEXT_SIZE._200}
            >
              {tDetail('kube_logs_tab_title_beta_status')}
            </OsdsText>
          </OsdsChip>
        </>
      ),
      to: useResolvedPath('logs').pathname,
    },
  ];

  const { data: kubeDetail } = useKubeDetail(projectId, kubeId);

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
            },
          ]}
        />
      )}
      <div className="header mt-8">
        <Headers
          title={kubeDetail?.name}
          headerButton={<PciGuidesHeader category="kubernetes" />}
        />
      </div>

      <div className="mb-8">
        <TabsPanel tabs={tabs} />
      </div>

      <Outlet />
    </>
  );
}
