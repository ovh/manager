import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext, useState } from 'react';
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
import useTracking from '@/hooks/useTracking';

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

  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  const { trackNavigationClick } = useTracking(
    COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN,
  );

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
      <div className="flex flex-col gap-8">
        <div>
          <Notifications />
        </div>

        <div className="sm:flex items-center justify-between">
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
              className="min-w-[15rem]"
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

        <FilterList filters={filters} onRemoveFilter={removeFilter} />

        <Datagrid
          columns={columns}
          items={paginatedArchives?.rows || []}
          totalItems={allArchives?.length || 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortChange={setSorting}
        />
        <Outlet />
      </div>
    </RedirectionGuard>
  );
}
