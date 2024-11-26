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
import { Suspense, useRef, useState } from 'react';
import {
  OsdsButton,
  OsdsIcon,
  OsdsMessage,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_MESSAGE_TYPE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
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
  const [searchQueries, setSearchQueries] = useState<string[]>([]);
  const filterPopoverRef = useRef(undefined);

  const { allUsers, paginatedUsers, isPending } = usePaginatedUsers(
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
    <RedirectionGuard
      isLoading={isPending}
      condition={!isPending && allUsers?.length === 0}
      route="../onboarding"
    >
      <div className="header mt-8">
        <Notifications />
      </div>
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        className="mt-6 block"
      >
        {t('pci_projects_project_storages_containers_users_title')}
      </OsdsText>
      <OsdsText
        level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        className="mt-6 block"
      >
        {t('pci_projects_project_storages_containers_users_user_description')}
      </OsdsText>
      {availability?.[AVAILABILITY.LOCALZONE] && (
        <OsdsMessage type={ODS_MESSAGE_TYPE.info} className="mt-6">
          {t('pci_projects_project_storages_containers_users_user_info_banner')}
        </OsdsMessage>
      )}

      <div className="sm:flex items-center justify-between mt-8">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="xs:mb-0.5 sm:mb-0"
          onClick={() => {
            clearNotifications();
            navigate('../create');
          }}
        >
          <OsdsIcon
            size={ODS_ICON_SIZE.xs}
            name={ODS_ICON_NAME.PLUS}
            className="mr-2 bg-white"
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t('pci_projects_project_storages_containers_users_add_user')}
        </OsdsButton>

        <div className="justify-between flex">
          <OsdsButton
            data-testid="refresh-button"
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="xs:mb-0.5 sm:mb-0 mr-4"
            onClick={() => {
              refresh();
            }}
          >
            <OsdsIcon
              size={ODS_ICON_SIZE.xs}
              name={ODS_ICON_NAME.REFRESH}
              className="mr-2"
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </OsdsButton>
          <OsdsSearchBar
            data-testid="search-bar"
            className="w-[14rem]"
            value={searchField}
            onOdsSearchSubmit={({ detail }) => {
              const { inputValue } = detail;
              if (inputValue) {
                setSearchField('');
                if (searchQueries.indexOf(inputValue) < 0) {
                  setSearchQueries([...searchQueries, inputValue]);
                  setPagination({
                    ...pagination,
                    pageIndex: 0,
                  });
                } else {
                  setSearchQueries([...searchQueries]);
                }
              }
            }}
          />
          <OsdsPopover ref={filterPopoverRef}>
            <OsdsButton
              slot="popover-trigger"
              size={ODS_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.stroked}
              class="ml-4"
            >
              <OsdsIcon
                name={ODS_ICON_NAME.FILTER}
                size={ODS_ICON_SIZE.xs}
                className="ml-2"
                color={ODS_THEME_COLOR_INTENT.primary}
              />
              {tFilter('common_criteria_adder_filter_label')}
            </OsdsButton>
            <OsdsPopoverContent>
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
                  filterPopoverRef.current?.closeSurface();
                }}
              />
            </OsdsPopoverContent>
          </OsdsPopover>
        </div>
      </div>

      <div className="my-8">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>

      {isPending ? (
        <OsdsSpinner
          inline
          size={ODS_SPINNER_SIZE.md}
          data-testid="List-spinner"
        />
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
    </RedirectionGuard>
  );
}
