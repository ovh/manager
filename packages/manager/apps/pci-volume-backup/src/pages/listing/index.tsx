import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import {
  Breadcrumb,
  Datagrid,
  BaseLayout,
  useResourcesV6,
  RedirectionGuard,
} from '@ovh-ux/manager-react-components';
import appConfig from '@/pci-volume-backup.config';
import {
  useDatagridColumn,
  toColumnDatagrids,
} from '@/pages/listing/useDatagridColumn';
import { TVolumeBackup } from '@/data/api/api.types';

export default function Listing() {
  const columns = useDatagridColumn();
  const { t } = useTranslation('listing');
  const { projectId } = useParams();

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
    columns: toColumnDatagrids(columns),
    route: `/cloud/project/${projectId}/aggregated/volumeBackup`,
    queryKey: [
      'pci-volume-backup',
      `/cloud/project/${projectId}/aggregated/volumeBackup`,
    ],
    pageSize: 10,
  });

  const shouldRedirectToOnboarding =
    !isLoading && !!volumeBackups && volumeBackups.length === 0;

  const header = {
    title: t('pci_projects_project_storages_volume_backup_list_header'),
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
          <Breadcrumb
            rootLabel={appConfig.rootLabel}
            appName="pci-volume-backup"
          />
        }
        header={header}
      >
        <React.Suspense>
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
        </React.Suspense>
      </BaseLayout>
    </RedirectionGuard>
  );
}
