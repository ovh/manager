import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Suspense, useContext, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  Datagrid,
  FilterAdd,
  FilterList,
  Notifications,
  RedirectionGuard,
  useColumnFilters,
  useDataGrid,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import {
  OdsButton,
  OdsInput,
  OdsPopover,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useProductRegionsAvailability } from '@ovh-ux/manager-pci-common';
import { usePaginatedArchive } from '@/api/hooks/useArchive';
import { useDatagridColumn } from './useDatagridColumn';
import { COLD_ARCHIVE_TRACKING } from '@/constants';

export default function ListingPage() {
  const { projectId } = useParams();
  const { t } = useTranslation(['cold-archive', 'containers']);
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchField, setSearchField] = useState('');
  const { pagination, setPagination, sorting, setSorting } = useDataGrid({
    id: 'name',
    desc: false,
  });
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { tracking } = useContext(ShellContext).shell;
  const {
    data: regions,
    isPending: isRegionsPending,
  } = useProductRegionsAvailability(
    ovhSubsidiary,
    'coldarchive.archive.hour.consumption',
  );
  const {
    paginatedArchives,
    allArchives,
    isPending: isContainersPending,
    isFetching,
    refresh,
  } = usePaginatedArchive(
    projectId,
    regions?.[0],
    pagination,
    sorting,
    filters,
  );
  const onHandleSearch = () => {
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
  };
  const columns = useDatagridColumn();
  const isPending = isRegionsPending || isContainersPending;

  return (
    <RedirectionGuard
      isLoading={isPending}
      condition={!isPending && allArchives?.length === 0}
      route="./onboarding"
    >
      <Notifications />
      <div className="sm:flex items-center justify-between mt-8">
        <div className="sm:flex">
          <OdsButton
            size="sm"
            color="primary"
            variant="outline"
            className="xs:mb-0.5 sm:mb-0"
            icon="plus"
            label={t(
              'pci_projects_project_storages_cold_archive_containers_add_container_label',
            )}
            onClick={() => {
              clearNotifications();
              tracking?.trackClick({
                name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER}`,
                type: 'navigation',
              });
              navigate('./new');
            }}
          />
          <OdsButton
            size="sm"
            color="primary"
            className="xs:mb-0.5 sm:mb-0 sm:ml-5"
            icon="circle-info"
            label={t(
              'pci_projects_project_storages_cold_archive_containers_manage_container_label',
            )}
            onClick={() => {
              clearNotifications();
              tracking?.trackClick({
                name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.MANAGE_CONTAINER}`,
                type: 'navigation',
              });
              navigate('./manage');
            }}
          />
        </div>
        <div className="flex justify-center gap-4">
          <OdsButton
            size="sm"
            variant="outline"
            color="primary"
            className="xs:mb-0.5 sm:mb-0"
            isDisabled={isFetching}
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
                onHandleSearch();
              }
            }}
            onOdsChange={({ detail }) => setSearchField(detail.value as string)}
          />
          <OdsButton
            label=""
            icon="magnifying-glass"
            size="sm"
            onClick={onHandleSearch}
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
                    'containers:pci_projects_project_storages_containers_name_label',
                  ),
                  comparators: FilterCategories.String,
                },
                {
                  id: 'createdAt',
                  label: t(
                    'pci_projects_project_storages_cold_archive_containers_creation_date_label',
                  ),
                  comparators: FilterCategories.Date,
                },
                {
                  id: 'objectsCount',
                  label: t(
                    'containers:pci_projects_project_storages_containers_storedObjects_label',
                  ),
                  comparators: FilterCategories.Numeric,
                },
                {
                  id: 'objectsSize',
                  label: t(
                    'containers:pci_projects_project_storages_containers_storedBytes_label',
                  ),
                  comparators: FilterCategories.Numeric,
                },
                {
                  id: 'lockedUntil',
                  label: t(
                    'containers:pci_projects_project_storages_cold_archive_containers_locked_until_label',
                  ),
                  comparators: FilterCategories.Date,
                },
                {
                  id: 'status',
                  label: t(
                    'pci_projects_project_storages_cold_archive_containers_status_label',
                  ),
                  comparators: FilterCategories.String,
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
          items={paginatedArchives?.rows || []}
          totalItems={allArchives?.length || 0}
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
