import React, { useMemo, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useProject } from '@ovh-ux/manager-pci-common';
import { FilterTypeCategories } from '@ovh-ux/manager-core-api';
import {
  Datagrid,
  BaseLayout,
  RedirectionGuard,
  useProjectUrl,
  PciGuidesHeader,
  ChangelogButton,
  Notifications,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useDatagridColumn } from '@/pages/listing/useDatagridColumn';
import { TVolumeBackup } from '@/data/api/api.types';
import { useVolumeBackups } from '@/data/hooks/useVolumeBackups';
import { getVolumeBackups, refetchInterval } from '@/data/api/volumeBackup';
import config from '@/pci-volume-backup.config';
import { backupsQueryKey } from '@/data/hooks/useVolumeBackup';

type ProjectParams = {
  projectId: string;
};

export default function Listing() {
  const columns = useDatagridColumn();
  const { t } = useTranslation('listing');
  const { projectId } = useParams() as ProjectParams;
  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();

  const columnsWithSearchable = useMemo(() => {
    return [
      ...columns.map((column) => ({
        ...column,
        isSearchable: false,
      })),
      {
        id: 'search',
        label: '',
        cell: () => <></>,
        isSearchable: true,
        isFilterable: false,
        isSortable: false,
        type: FilterTypeCategories.String,
      },
    ];
  }, [columns]);

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
    columns: columnsWithSearchable,
    route: `/cloud/project/${projectId}/aggregated/volumeBackup`,
    queryFn: async () =>
      getVolumeBackups(projectId)().then(({ data }) => {
        return {
          data: data.map((volume: TVolumeBackup) => ({
            ...volume,
            search: `${volume.id} ${volume.name} ${volume.region}`,
          })),
        };
      }),
    refetchInterval,
    queryKey: backupsQueryKey(projectId),
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
    <OdsButton
      icon={ODS_ICON_NAME.plus}
      size={ODS_BUTTON_SIZE.sm}
      color="primary"
      variant="outline"
      label={t(
        'pci_projects_project_storages_volume_backup_list_datagrid_menu_topbar_action_create',
      )}
      onClick={() => {
        clearNotifications();
        navigate('../create');
      }}
    />
  );

  return (
    <RedirectionGuard
      isLoading={isLoading}
      route="../onboarding"
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
        <div className="my-4">
          <Notifications />
        </div>

        {columnsWithSearchable && (
          <Datagrid
            columns={columnsWithSearchable}
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

        <Suspense>
          <Outlet />
        </Suspense>
      </BaseLayout>
    </RedirectionGuard>
  );
}
