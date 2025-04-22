import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  OdsButton,
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useProject } from '@ovh-ux/manager-pci-common';
import {
  Datagrid,
  BaseLayout,
  RedirectionGuard,
  useProjectUrl,
  PciGuidesHeader,
  ChangelogButton,
} from '@ovh-ux/manager-react-components';
import { useDatagridColumn } from '@/pages/listing/useDatagridColumn';
import { TVolumeBackup } from '@/data/api/api.types';
import { useVolumeBackups } from '@/data/hooks/useVolumeBackups';
import {
  getVolumeBackups,
  refetchInterval,
} from '@/data/api/pci-volume-backup';
import config from '@/pci-volume-backup.config';

type ProjectParams = {
  projectId: string;
};

export default function Listing() {
  const columns = useDatagridColumn();
  const { t } = useTranslation('listing');
  const { projectId } = useParams() as ProjectParams;
  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();

  const {
    data: { data: volumeBackups } = {},
    flattenData,
    totalCount,
    hasNextPage,
    fetchNextPage,
    isLoading,
    search,
    sorting,
    setSorting,
    filters,
  } = useVolumeBackups<TVolumeBackup>({
    columns,
    route: `/cloud/project/${projectId}/aggregated/volumeBackup`,
    queryFn: getVolumeBackups(projectId),
    refetchInterval,
    queryKey: [
      'pci-volume-backup',
      `/cloud/project/${projectId}/aggregated/volumeBackup`,
    ],
    pageSize: 10,
    defaultSorting: {
      id: 'creationDate',
      desc: true,
    },
  });

  const shouldRedirectToOnboarding =
    !isLoading && !!volumeBackups && volumeBackups.length === 0;

  const header = {
    title: t('pci_projects_project_storages_volume_backup_list_header'),
    headerButton: <PciGuidesHeader category="volumeBackup" />,
    changelogButton: <ChangelogButton links={config.changeLogLinks} />,
  };

  const TopbarCTA = () => (
    <div>
      <OdsButton
        icon={ODS_ICON_NAME.plus}
        size={ODS_BUTTON_SIZE.sm}
        label={t(
          'pci_projects_project_storages_volume_backup_list_datagrid_menu_topbar_action_create',
        )}
      />
    </div>
  );

  return (
    <RedirectionGuard
      isLoading={isLoading}
      route="./onboarding"
      condition={shouldRedirectToOnboarding}
    >
      <BaseLayout
        breadcrumb={
          <OdsBreadcrumb>
            <OdsBreadcrumbItem
              label={project?.description}
              href={hrefProject}
            />
            <OdsBreadcrumbItem
              label={t(
                'pci_projects_project_storages_volume_backup_list_header',
              )}
              href="#"
            />
          </OdsBreadcrumb>
        }
        header={header}
      >
        {columns && (
          <Datagrid
            columns={columns}
            items={flattenData || []}
            totalItems={totalCount || 0}
            hasNextPage={hasNextPage && !isLoading}
            onFetchNextPage={fetchNextPage}
            sorting={sorting}
            onSortChange={setSorting}
            isLoading={isLoading}
            filters={filters}
            search={search}
            topbar={<TopbarCTA />}
          />
        )}
      </BaseLayout>
    </RedirectionGuard>
  );
}
