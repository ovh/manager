import {
  Datagrid,
  FilterAdd,
  FilterList,
  Notifications,
  useColumnFilters,
  useDataGrid,
  useFeatureAvailability,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { Suspense, useState } from 'react';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  OdsButton,
  OdsMessage,
  OdsPopover,
  OdsSpinner,
  OdsInput,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { usePaginatedUsers } from '@/api/hooks/useUser';
import { useDatagridColumn } from './useDatagridColumn';
import queryClient from '@/queryClient';
import { AVAILABILITY } from '@/constants';

export default function Listing() {
  const { t } = useTranslation('objects/users');
  const { t: tFilter } = useTranslation('filters');

  const { projectId } = useParams();
  const { pagination, setPagination, sorting, setSorting } = useDataGrid();

  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchField, setSearchField] = useState('');

  const { paginatedUsers, isPending } = usePaginatedUsers(
    projectId,
    pagination,
    sorting,
    filters,
  );

  const columns = useDatagridColumn();

  const { data: availability } = useFeatureAvailability([
    AVAILABILITY.LOCALZONE,
  ]);

  const refresh = async () => {
    queryClient.invalidateQueries({
      queryKey: ['project', projectId, 'users'],
    });
  };

  return (
    <>
      <div className="header mt-8">
        <Notifications />
      </div>
      <OdsText preset="heading-4" className="mt-6 block">
        {t('pci_projects_project_storages_containers_users_title')}
      </OdsText>
      <OdsText preset="paragraph" className="mt-6 block">
        {t('pci_projects_project_storages_containers_users_user_description')}
      </OdsText>
      {availability?.[AVAILABILITY.LOCALZONE] && (
        <OdsMessage
          color="information"
          className="mt-6 w-full"
          isDismissible={false}
        >
          {t('pci_projects_project_storages_containers_users_user_info_banner')}
        </OdsMessage>
      )}

      <div className="sm:flex items-center justify-between mt-8">
        <OdsButton
          label={t('pci_projects_project_storages_containers_users_add_user')}
          size="sm"
          icon="plus"
          color="primary"
          className="xs:mb-0.5 sm:mb-0"
          onClick={() => {
            clearNotifications();
            navigate('./new');
          }}
        />

        <div className="justify-between flex">
          <OdsButton
            data-testid="refresh-button"
            label=""
            size="sm"
            icon="refresh"
            variant="outline"
            color="primary"
            className="xs:mb-0.5 sm:mb-0 mr-4"
            onClick={() => {
              refresh();
            }}
          ></OdsButton>
          <OdsInput
            data-testid="search-bar"
            className="w-[14rem]"
            value={searchField}
            type="search"
            color="primary"
            name="searchField"
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                setPagination({
                  pageIndex: 0,
                  pageSize: pagination.pageSize,
                });
                addFilter({
                  key: 'search',
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
              label={tFilter('common_criteria_adder_filter_label')}
              size="sm"
              color="primary"
              id="popover-filter"
              icon="filter"
              variant="outline"
              class="ml-4"
            />
          </div>
          <OdsPopover triggerId="popover-filter">
            <FilterAdd
              columns={[
                {
                  id: 'username',
                  label: t(
                    'pci_projects_project_storages_containers_users_username',
                  ),
                  comparators: FilterCategories.String,
                },
                {
                  id: 'description',
                  label: t(
                    'pci_projects_project_storages_containers_users_description',
                  ),
                  comparators: FilterCategories.String,
                },
                {
                  id: 'access',
                  label: t(
                    'pci_projects_project_storages_containers_users_accesskey',
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

      <div className="my-8">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>

      {isPending ? (
        <OdsSpinner size="md" data-testid="List-spinner" />
      ) : (
        <Datagrid
          columns={columns}
          items={paginatedUsers?.rows || []}
          totalItems={paginatedUsers?.totalRows || 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortChange={setSorting}
          className="overflow-x-visible"
        />
      )}
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
