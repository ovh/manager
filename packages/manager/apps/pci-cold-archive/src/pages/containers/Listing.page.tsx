import {
  FilterCategories,
  FilterComparator,
  FilterTypeCategories,
} from '@ovh-ux/manager-core-api';
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
import {
  OdsButton,
  OdsInput,
  OdsPopover,
} from '@ovhcloud/ods-components/react';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useTracking } from '@/hooks/useTracking';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import { useArchiveRegion, usePaginatedArchive } from '@/api/hooks/useArchive';
import { useDatagridColumn } from './useDatagridColumn';

export default function ListingPage() {
  const { t } = useTranslation(['cold-archive', 'containers']);

  const { projectId } = useParams();
  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchField, setSearchField] = useState('');
  const { pagination, setPagination, sorting, setSorting } = useDataGrid({
    id: 'name',
    desc: false,
  });

  const { trackNavigationClick } = useTracking(
    COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN,
  );

  const region = useArchiveRegion();

  const {
    paginatedArchives,
    allArchives,
    allFilteredArchives,
    isPending: isContainersPending,
    isFetching,
    refresh,
  } = usePaginatedArchive(projectId, region, pagination, sorting, filters);

  const onHandleSearch = () => {
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
    addFilter({
      key: 'name',
      value: searchField.trim(),
      comparator: FilterComparator.Includes,
      label: '',
    });
    setSearchField('');
  };

  const columns = useDatagridColumn();

  const isPending = !region || isContainersPending || isFetching;

  return (
    <RedirectionGuard
      isLoading={isPending}
      condition={!isPending && allArchives?.length === 0}
      route="./onboarding"
    >
      <div className="flex flex-col gap-5">
        <div>
          <Notifications />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5">
          <div className="flex flex-col sm:flex-row gap-4">
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
                trackNavigationClick(
                  COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER,
                );
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
                trackNavigationClick(
                  COLD_ARCHIVE_TRACKING.CONTAINERS.MANAGE_CONTAINER,
                );
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
              className="md:min-w-[15rem]"
              value={searchField}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  onHandleSearch();
                }
              }}
              onOdsChange={({ detail }) =>
                setSearchField(detail.value as string)
              }
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
                    type: FilterTypeCategories.String,
                  },
                  {
                    id: 'createdAt',
                    label: t(
                      'pci_projects_project_storages_cold_archive_containers_creation_date_label',
                    ),
                    comparators: FilterCategories.Date,
                    type: FilterTypeCategories.Date,
                  },
                  {
                    id: 'objectsCount',
                    label: t(
                      'containers:pci_projects_project_storages_containers_storedObjects_label',
                    ),
                    comparators: FilterCategories.Numeric,
                    type: FilterTypeCategories.Numeric,
                  },
                  {
                    id: 'objectsSize',
                    label: t(
                      'containers:pci_projects_project_storages_containers_storedBytes_label',
                    ),
                    comparators: FilterCategories.Numeric,
                    type: FilterTypeCategories.Numeric,
                  },
                  {
                    id: 'lockedUntil',
                    label: t(
                      'containers:pci_projects_project_storages_cold_archive_containers_locked_until_label',
                    ),
                    comparators: FilterCategories.Date,
                    type: FilterTypeCategories.Date,
                  },
                  {
                    id: 'status',
                    label: t(
                      'pci_projects_project_storages_cold_archive_containers_status_label',
                    ),
                    comparators: FilterCategories.String,
                    type: FilterTypeCategories.String,
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

        <div>
          <FilterList filters={filters} onRemoveFilter={removeFilter} />
        </div>

        <Datagrid
          columns={columns}
          items={paginatedArchives?.rows || []}
          totalItems={allFilteredArchives?.length || 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortChange={setSorting}
        />
        <Suspense>
          <Outlet />
        </Suspense>
      </div>
    </RedirectionGuard>
  );
}
