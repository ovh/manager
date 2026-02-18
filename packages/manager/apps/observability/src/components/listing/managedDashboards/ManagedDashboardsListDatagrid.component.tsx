import { useEffect, useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { BADGE_COLOR, Badge } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FilterCategories, FilterTypeCategories } from '@ovh-ux/manager-core-api';
import { DatagridColumn, useFormatDate, useNotifications } from '@ovh-ux/muk';

import DatagridCellEnpoint from '@/components/listing/common/datagrid/datagrid-cell-endpoint/DataGridCellEndpoint.component';
import FilteredDatagrid from '@/components/listing/common/datagrid/filtered-datagrid/FilteredDatagrid.component';
import { ManagedDashboardsListDatagridProps } from '@/components/listing/managedDashboards/ManagedDashboardsListDatagrid.props';
import ManagedDashboardsActions from '@/components/listing/managedDashboards/actions/ManagedDashboardsActions.component';
import ManagedDashboardsListTopbar from '@/components/listing/managedDashboards/top-bar/ManagedDashboardsListTopbar.component';
import ResourceBadgeStatus from '@/components/services/status/ResourceBadgeStatus.component';
import { useObservabilityServiceContext } from '@/contexts/ObservabilityService.context';
import { DatasourceConfiguration } from '@/types/DatasourceConfiguration';
import { GrafanaListing } from '@/types/managedDashboards.type';
import { RESOURCE_TYPES } from '@/utils/iam.constants';
import { mapGrafanaToListing } from '@/utils/managedDashboards.utils';

export default function ManagedDashboardsListDatagrid({
  managedDashboardsList,
  isLoading,
  error,
  isError,
}: ManagedDashboardsListDatagridProps) {
  const { t } = useTranslation([
    'managed-dashboards',
    'shared',
    NAMESPACES.DASHBOARD,
    NAMESPACES.FORM,
    NAMESPACES.ERROR,
    NAMESPACES.STATUS,
  ]);
  const { addError } = useNotifications();
  const formatDate = useFormatDate();
  const { selectedService } = useObservabilityServiceContext();
  const resourceName = selectedService?.id ?? '';
  const columns: DatagridColumn<GrafanaListing>[] = useMemo(
    () => [
      {
        id: 'name',
        header: t(`${NAMESPACES.DASHBOARD}:name`),
        label: t(`${NAMESPACES.DASHBOARD}:name`),
        accessorKey: 'name',
        comparator: FilterCategories.String,
        type: FilterTypeCategories.String,
        isSearchable: true,
        isFilterable: true,
        size: 200,
      },
      {
        id: 'description',
        header: t(`${NAMESPACES.DASHBOARD}:description`),
        label: t(`${NAMESPACES.DASHBOARD}:description`),
        accessorKey: 'description',
        comparator: FilterCategories.String,
        type: FilterTypeCategories.String,
        isSearchable: true,
        isFilterable: true,
        size: 200,
      },
      {
        id: 'endpoint',
        header: t(`managed-dashboards:listing.endpoint_cell`),
        label: t(`managed-dashboards:listing.endpoint_cell`),
        accessorFn: (row: GrafanaListing) => row,
        cell: ({ getValue }) => {
          const { infrastructure } = getValue() as GrafanaListing;
          return <DatagridCellEnpoint infrastructure={infrastructure} />;
        },
        comparator: FilterCategories.String,
        type: FilterTypeCategories.String,
        isSearchable: true,
        isFilterable: true,
        size: 200,
      },
      {
        id: 'status',
        header: t(`${NAMESPACES.STATUS}:status`),
        label: t(`${NAMESPACES.STATUS}:status`),
        accessorFn: (row: GrafanaListing) => row,
        cell: ({ getValue }) => {
          const { resourceStatus } = getValue() as GrafanaListing;
          return <ResourceBadgeStatus status={resourceStatus} />;
        },
        comparator: FilterCategories.String,
        type: FilterTypeCategories.String,
        isSearchable: true,
        isFilterable: true,
        size: 120,
      },
      {
        id: 'configuration',
        header: t(`managed-dashboards:listing.configuration_cell`),
        label: t(`managed-dashboards:listing.configuration_cell`),
        accessorKey: 'configuration',
        cell: ({ getValue }): string => {
          const configuration = getValue<DatasourceConfiguration>();
          return t(`managed-dashboards:configuration.${configuration}`);
        },
        comparator: FilterCategories.String,
        type: FilterTypeCategories.String,
        isSearchable: true,
        isFilterable: true,
        size: 120,
      },
      {
        id: 'version',
        header: t(`managed-dashboards:listing.version_cell`),
        label: t(`managed-dashboards:listing.version_cell`),
        accessorFn: (row: GrafanaListing) => row,
        cell: ({ getValue }) => {
          const { version, deprecated } = getValue() as GrafanaListing;
          return (
            <div className="flex flex-col gap-2">
              {version}{' '}
              {deprecated && (
                <Badge color={BADGE_COLOR.critical}>
                  {t('managed-dashboards:version.end_of_support')}
                </Badge>
              )}
            </div>
          );
        },
        comparator: FilterCategories.String,
        type: FilterTypeCategories.String,
        isSearchable: true,
        isFilterable: true,
        size: 150,
      },
      {
        id: 'isAccessLimited',
        header: t(`managed-dashboards:listing.isAccessLimited_cell`),
        label: t(`managed-dashboards:listing.isAccessLimited_cell`),
        accessorKey: 'isAccessLimited',
        cell: ({ getValue }): string => {
          const isAccessLimited = getValue<boolean>();
          return t(`${NAMESPACES.FORM}:${isAccessLimited ? 'yes' : 'no'}`);
        },
        comparator: FilterCategories.Boolean,
        type: FilterTypeCategories.Boolean,
        isSearchable: true,
        isFilterable: true,
        size: 150,
      },
      {
        id: 'updatedAt',
        header: t(`managed-dashboards:listing.lastModified_cell`),
        label: t(`managed-dashboards:listing.lastModified_cell`),
        accessorKey: 'updatedAt',
        cell: ({ getValue }) => {
          const updatedAt = getValue() as string;
          return formatDate({ date: updatedAt, format: 'Pp' });
        },
        comparator: FilterCategories.Boolean,
        type: FilterTypeCategories.Boolean,
        isSearchable: true,
        isFilterable: true,
        size: 150,
      },
      {
        id: 'actions',
        header: '',
        accessorFn: (row: GrafanaListing) => row,
        cell: ({ getValue }) => (
          <ManagedDashboardsActions
            managedDashboard={getValue<GrafanaListing>()}
            resourceName={resourceName}
          />
        ),
        isSearchable: false,
        isFilterable: false,
        size: 40,
      },
    ],
    [t, formatDate, resourceName],
  );

  useEffect(() => {
    if (isError) {
      addError(
        t(`${NAMESPACES.ERROR}:error_message`, {
          message: error?.message,
        }),
      );
    }
  }, [addError, error, isError, t]);

  const listingManagedDashboards = useMemo(() => {
    if (!managedDashboardsList) return [];
    return mapGrafanaToListing(managedDashboardsList);
  }, [managedDashboardsList]);

  const topbar = useMemo(() => <ManagedDashboardsListTopbar />, []);

  if (!managedDashboardsList) {
    return null;
  }

  return (
    <FilteredDatagrid<GrafanaListing>
      topbar={topbar}
      columns={columns}
      data={listingManagedDashboards}
      isLoading={isLoading}
      resourceType={RESOURCE_TYPES.GRAFANA}
      searchFilterLabel={t('shared:listing.filter_search_key')}
    />
  );
}
