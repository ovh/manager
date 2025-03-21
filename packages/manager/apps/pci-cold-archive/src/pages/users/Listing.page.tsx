import { FilterComparator } from '@ovh-ux/manager-core-api';
import {
  Datagrid,
  FilterAdd,
  FilterList,
  Notifications,
  useColumnFilters,
  useDataGrid,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ColumnFilter } from '@ovh-ux/manager-react-components/dist/types/src/components/filters/filter-add.component';
import {
  OdsButton,
  OdsInput,
  OdsPopover,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { Suspense, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { usePaginatedUsers } from '@/api/hooks/useUsers';
import { useTracking } from '@/hooks/useTracking';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import { useDatagridColumn } from './useDatagridColumn';

export default function UsersListing() {
  const { t } = useTranslation('users');

  const { projectId } = useParams();
  const { pagination, setPagination, sorting, setSorting } = useDataGrid({
    desc: false,
    id: 'username',
  });

  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchField, setSearchField] = useState('');

  const columns = useDatagridColumn();

  const { trackNavigationClick } = useTracking(COLD_ARCHIVE_TRACKING.USER.MAIN);

  const { paginatedUsers, refetch, isLoading } = usePaginatedUsers(
    projectId,
    pagination,
    sorting,
    filters,
  );

  const handleSearch = () => {
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
    addFilter({
      key: 'username',
      value: searchField.trim(),
      comparator: FilterComparator.Includes,
      label: '',
    });
    setSearchField('');
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <Notifications />
      </div>

      <OdsText preset="heading-4">
        {t('pci_projects_project_storages_containers_users_title')}
      </OdsText>

      <OdsText preset="paragraph">
        {t('pci_projects_project_storages_containers_users_user_description')}
      </OdsText>

      <div className="sm:flex items-center justify-between">
        <OdsButton
          label={t('pci_projects_project_storages_containers_users_add_user')}
          size="sm"
          icon="plus"
          color="primary"
          className="xs:mb-0.5 sm:mb-0"
          onClick={() => {
            clearNotifications();
            trackNavigationClick(COLD_ARCHIVE_TRACKING.USER.ADD_USER);
            navigate('./new');
          }}
        />

        <div className="flex justify-center gap-4">
          <OdsButton
            size="sm"
            variant="outline"
            color="primary"
            className="xs:mb-0.5 sm:mb-0"
            onClick={refetch}
            icon="refresh"
            label=""
          />
          <OdsInput
            name="searchField"
            className="min-w-[15rem]"
            value={searchField}
            onOdsChange={({ detail }) => setSearchField(detail.value as string)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') handleSearch();
            }}
          />
          <OdsButton
            label=""
            icon="magnifying-glass"
            size="sm"
            onClick={handleSearch}
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
              columns={
                [...columns].filter(
                  (column) => column.isFilterable,
                ) as ColumnFilter[]
              }
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
        items={isLoading ? [] : paginatedUsers?.rows}
        totalItems={paginatedUsers?.totalRows || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortChange={setSorting}
        isLoading={isLoading}
      />
      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
}
