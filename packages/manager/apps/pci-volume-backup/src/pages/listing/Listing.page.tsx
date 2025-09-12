import React, { Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import {
  OdsButton,
  OdsBreadcrumb,
  OdsBreadcrumbItem,
} from '@ovhcloud/ods-components/react';
import { Outlet, useParams, useNavigate } from 'react-router-dom';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useProject } from '@ovh-ux/manager-pci-common';
import {
  Datagrid,
  BaseLayout,
  RedirectionGuard,
  useProjectUrl,
  PciGuidesHeader,
  ChangelogButton,
  Notifications,
  useNotifications,
  useResourcesV6,
} from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { useDatagridColumn } from '@/pages/listing/useDatagridColumn';
import { TProjectParams, TVolumeBackup } from '@/data/api/api.types';
import config from '@/pci-volume-backup.config';
import { VOLUME_BACKUP_TRACKING } from '@/tracking.constant';
import { getBackupsResourcesV6QueryOptions } from '@/data/hooks/useVolumeBackup';

export default function Listing() {
  const columns = useDatagridColumn();
  const { t } = useTranslation('listing');
  const { projectId } = useParams() as TProjectParams;
  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject(projectId, ({
    throwOnError: true,
    retry: false,
  } as unknown) as Parameters<typeof useProject>[1]);
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();

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
  } = useResourcesV6<TVolumeBackup>({
    ...getBackupsResourcesV6QueryOptions(projectId),
    columns,
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
        trackClick({
          actionType: 'action',
          actions: VOLUME_BACKUP_TRACKING.LISTING.ADD,
        });
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

        <Suspense>
          <Outlet />
        </Suspense>
      </BaseLayout>
    </RedirectionGuard>
  );
}
