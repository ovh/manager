import {
  Datagrid,
  FilterAdd,
  FilterList,
  Notifications,
  PciMaintenanceBanner,
  RedirectionGuard,
  useColumnFilters,
  useDataGrid,
  useNotifications,
  useProductMaintenance,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Suspense, useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import {
  OdsButton,
  OdsInput,
  OdsPopover,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import { PciAnnouncementBanner } from '@ovh-ux/manager-pci-common';
import { useStorages } from '@/api/hooks/useStorages';
import { useDatagridColumn } from './useDatagridColumn';
import { useStorageFeatures } from '@/hooks/useStorageFeatures';

export default function ListingPage() {
  const { t } = useTranslation(['containers', 'containers/add', 'pci-common']);

  const { projectId } = useParams();
  const navigate = useNavigate();
  const { tracking } = useContext(ShellContext).shell;
  const { clearNotifications } = useNotifications();
  const columns = useDatagridColumn();
  const { pagination, setPagination, sorting, setSorting } = useDataGrid({
    id: 'name',
    desc: false,
  });
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchField, setSearchField] = useState('');
  const { hasMaintenance, maintenanceURL } = useProductMaintenance(projectId);

  const {
    is3azAvailable,
    isLocalZoneAvailable,
    isPending: isAvailabilityPending,
  } = useStorageFeatures();

  const {
    allStorages,
    paginatedStorages,
    isRefreshing,
    isPending: isStoragesPending,
    refresh,
  } = useStorages(projectId, pagination, sorting, filters, {
    isLocalZoneAvailable,
    is3azAvailable,
  });

  const isPending = isAvailabilityPending || isStoragesPending;

  if (isPending) {
    return <OdsSpinner size="md" className="mt-8" />;
  }

  return (
    <RedirectionGuard
      isLoading={isRefreshing}
      condition={!isRefreshing && allStorages?.resources.length === 0}
      route="./onboarding"
    >
      <Notifications />
      {hasMaintenance && (
        <PciMaintenanceBanner maintenanceURL={maintenanceURL} />
      )}
      <PciAnnouncementBanner projectId={projectId} />
      <div className="sm:flex items-center justify-between mt-8">
        <OdsButton
          size="sm"
          color="primary"
          className="xs:mb-0.5 sm:mb-0"
          icon="plus"
          label={t(
            'containers/add:pci_projects_project_storages_containers_add_title',
          )}
          onClick={() => {
            clearNotifications();
            navigate('./new');
            tracking?.trackClick({
              name: 'PCI_PROJECTS_CONTAINERS_ADD',
              type: 'navigaton',
            });
          }}
        />
        <div className="flex justify-center gap-4">
          <OdsButton
            size="sm"
            variant="outline"
            color="primary"
            className="xs:mb-0.5 sm:mb-0"
            isDisabled={isRefreshing || undefined}
            onClick={refresh}
            icon="refresh"
            label=""
          />
          <OdsInput
            name="searchField"
            className="min-w-[15rem]"
            value={searchField}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setPagination({
                  pageIndex: 0,
                  pageSize: pagination.pageSize,
                });
                addFilter({
                  key: 'name',
                  value: searchField,
                  comparator: FilterComparator.Includes,
                  label: '',
                });
                setSearchField('');
              }
            }}
            onOdsChange={({ detail }) => setSearchField(detail.value as string)}
          />
          <OdsButton
            label=""
            icon="magnifying-glass"
            size="sm"
            onClick={() => {
              setPagination({
                pageIndex: 0,
                pageSize: pagination.pageSize,
              });
              addFilter({
                key: 'name',
                value: searchField,
                comparator: FilterComparator.Includes,
                label: '',
              });
              setSearchField('');
            }}
          />

          <OdsButton
            slot="popover-trigger"
            id="popover-filter"
            size="sm"
            color="primary"
            label={t('pci-common:common_criteria_adder_filter_label')}
            variant="outline"
            icon="filter"
          />

          <OdsPopover triggerId="popover-filter">
            <FilterAdd
              columns={[
                {
                  id: 'name',
                  label: t(
                    'pci_projects_project_storages_containers_name_label',
                  ),
                  comparators: FilterCategories.String,
                },
                {
                  id: 'region',
                  label: t(
                    'pci_projects_project_storages_containers_region_label',
                  ),
                  comparators: FilterCategories.String,
                },
                {
                  id: 'mode',
                  label: t(
                    'pci_projects_project_storages_containers_deployment_mode_label',
                  ),
                  comparators: FilterCategories.String,
                },
                {
                  id: 'offer',
                  label: t(
                    'pci_projects_project_storages_containers_offer_label',
                  ),
                  comparators: FilterCategories.String,
                },
                // Uncomment this when the numeric filter is fixed in Manager React Components
                // {
                //   id: 'containerCount',
                //   label: t(
                //     'pci_projects_project_storages_containers_storedObjects_label',
                //   ),
                //   comparators: FilterCategories.Numeric,
                // },
              ]}
              onAddFilter={(addedFilter, column) => {
                setPagination({
                  pageIndex: 0,
                  pageSize: pagination.pageSize,
                });
                addFilter({
                  ...addedFilter,
                  label: column.label,
                });
              }}
            />
          </OdsPopover>
        </div>
      </div>

      {filters?.length > 0 && (
        <div className="my-5">
          <FilterList filters={filters} onRemoveFilter={removeFilter} />
        </div>
      )}

      <div className="mt-8">
        <Datagrid
          columns={columns}
          items={paginatedStorages?.rows || []}
          totalItems={allStorages?.resources?.length || 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortChange={setSorting}
        />
      </div>

      <Suspense>
        <Outlet />
      </Suspense>
    </RedirectionGuard>
  );
}
