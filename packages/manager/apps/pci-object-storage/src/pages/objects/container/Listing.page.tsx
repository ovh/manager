import {
  Datagrid,
  FilterAdd,
  FilterList,
  Notifications,
  RedirectionGuard,
  useColumnFilters,
  useDataGrid,
  useFeatureAvailability,
  useNotifications,
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
import { useStorages } from '@/api/hooks/useStorages';
import { useDatagridColumn } from './useDatagridColumn';
import { AVAILABILITY } from '@/constants';

export default function ListingPage() {
  const { t } = useTranslation([
    'pci-storages-containers',
    'containers/add',
    'pci-common',
  ]);
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

  const {
    data: availability,
    isPending: isAvailabilityPending,
  } = useFeatureAvailability([AVAILABILITY.LOCALZONE, AVAILABILITY['3AZ']]);

  const {
    allStorages,
    paginatedStorages,
    isRefreshing,
    isPending: isStoragesPending,
    refresh,
  } = useStorages(projectId, pagination, sorting, filters, {
    isLocalZoneAvailable: availability?.[AVAILABILITY.LOCALZONE],
    is3azAvailable: availability?.[AVAILABILITY['3AZ']],
  });

  const isPending = isAvailabilityPending || isStoragesPending;

  if (isPending) {
    return <OdsSpinner size="md" />;
  }

  return (
    <RedirectionGuard
      isLoading={isPending}
      condition={!isPending && allStorages?.resources.length === 0}
      route="./onboarding"
    >
      <Notifications />
      <div className="sm:flex items-center justify-between mt-4">
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
        <div className="justify-between flex space-x-4">
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
            type="search"
            name="searchField"
            className="w-[70%]"
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
            onOdsChange={(event) => {
              const value = event.detail.value.toString();
              setSearchField(value);
            }}
          />
          <div>
            <OdsButton
              slot="popover-trigger"
              id="popover-filter"
              size="sm"
              color="primary"
              label={t('pci-common:common_criteria_adder_filter_label')}
              variant="outline"
              icon="filter"
            />
          </div>
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
                {
                  id: 'storedObjects',
                  label: t(
                    'pci_projects_project_storages_containers_storedObjects_label',
                  ),
                  comparators: FilterCategories.Numeric,
                },
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
          className="overflow-x-visible"
        />
      </div>

      <Suspense>
        <Outlet />
      </Suspense>
    </RedirectionGuard>
  );
}
