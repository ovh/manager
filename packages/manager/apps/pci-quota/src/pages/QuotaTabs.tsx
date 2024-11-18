import {
  BaseLayout,
  PciGuidesHeader,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { Outlet, useParams, useMatch, useResolvedPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { useProject, TabsPanel } from '@ovh-ux/manager-pci-common';
import { ROUTE_PATHS } from '@/routes';

export default function QuotaTabs() {
  const { t } = useTranslation(['regions', 'quotas']);
  const hrefProject = useProjectUrl('public-cloud');
  const { projectId } = useParams();
  const { data: project } = useProject(projectId);

  const quotasMatch = useMatch({
    path: `${ROUTE_PATHS.ROOT}/${ROUTE_PATHS.QUOTA}/*`,
    end: false,
  });

  const isQuotasTab = Boolean(quotasMatch);

  const tabs = [
    {
      name: 'quota',
      title: t('pci_projects_project_quota', { ns: 'quotas' }),
      to: useResolvedPath(ROUTE_PATHS.QUOTA).pathname,
    },
    {
      name: 'regions',
      title: t('pci_projects_project_regions', { ns: 'regions' }),
      to: useResolvedPath(ROUTE_PATHS.REGIONS).pathname,
    },
  ];

  return (
    <BaseLayout
      breadcrumb={
        <OdsBreadcrumb>
          <OdsBreadcrumbItem href={hrefProject} label={project?.description} />
          <OdsBreadcrumbItem
            label={
              isQuotasTab
                ? t('pci_projects_project_quota', { ns: 'quotas' })
                : t('pci_projects_project_regions', { ns: 'regions' })
            }
            href={''}
          />
        </OdsBreadcrumb>
      }
      header={{
        headerButton: <PciGuidesHeader category="instances" />,
      }}
      tabs={<TabsPanel tabs={tabs} />}
    >
      <Outlet />
    </BaseLayout>
  );
}
