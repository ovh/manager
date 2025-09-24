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
import { Suspense, useContext, useState } from 'react';
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
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { usePaginatedUsers } from '@/api/hooks/useUser';
import { useDatagridColumn } from './useDatagridColumn';
import queryClient from '@/queryClient';
import { AVAILABILITY, TRACKING_PREFIX } from '@/constants';

export default function Listing() {
  const { t } = useTranslation('objects/users');

  const { projectId } = useParams();
  const { pagination, setPagination, sorting, setSorting } = useDataGrid();

  const { tracking } = useContext(ShellContext).shell;

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
            tracking?.trackClick({
              name: `${TRACKING_PREFIX}s3-policies-users::add`,
              type: 'action',
            });

            clearNotifications();
            navigate('./new');
          }}
        />

        <div className="flex justify-center gap-4">
          <OdsButton
            size="sm"
            variant="outline"
            color="primary"
            className="xs:mb-0.5 sm:mb-0"
            onClick={refresh}
            icon="refresh"
            label=""
          />
          <OdsInput
            name="searchField"
            className="min-w-[15rem]"
            value={searchField}
            onOdsChange={({ detail }) => setSearchField(detail.value as string)}
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
                key: 'search',
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

      <div className="my-8 mt-8">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>

      {isPending ? (
        <OdsSpinner size="md" data-testid="List-spinner" className="mt-8" />
      ) : (
        <div className="mt-8">
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
        </div>
      )}
      <Suspense>
        <Outlet />
      </Suspense>
    </>
  );
}
