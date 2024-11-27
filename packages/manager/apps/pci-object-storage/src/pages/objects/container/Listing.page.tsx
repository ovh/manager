import {
  Datagrid,
  FilterAdd,
  FilterList,
  useColumnFilters,
  useDataGrid,
  useFeatureAvailability,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { Suspense, useContext, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
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
  const filterPopoverRef = useRef(undefined);

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
    return <OsdsSpinner size={ODS_SPINNER_SIZE.md} inline />;
  }

  return (
    <>
      <div className="sm:flex items-center justify-between mt-4">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.flat}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="xs:mb-0.5 sm:mb-0"
          onClick={() => {
            clearNotifications();
            navigate('./new');
            tracking?.trackClick({
              name: 'PCI_PROJECTS_CONTAINERS_ADD',
              type: 'navigaton',
            });
          }}
        >
          <OsdsIcon
            size={ODS_ICON_SIZE.xs}
            name={ODS_ICON_NAME.PLUS}
            className="mr-2 bg-white"
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t(
            'containers/add:pci_projects_project_storages_containers_add_title',
          )}
        </OsdsButton>
        <div className="justify-between flex space-x-4">
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="xs:mb-0.5 sm:mb-0"
            disabled={isRefreshing || undefined}
            onClick={refresh}
          >
            <OsdsIcon
              size={ODS_ICON_SIZE.xs}
              name={ODS_ICON_NAME.REFRESH}
              className="mr-2"
              color={ODS_THEME_COLOR_INTENT.primary}
            />
          </OsdsButton>
          <OsdsSearchBar
            className="w-[70%]"
            value={searchField}
            onOdsSearchSubmit={({ detail }) => {
              setPagination({
                pageIndex: 0,
                pageSize: pagination.pageSize,
              });
              addFilter({
                key: 'name',
                value: detail.inputValue,
                comparator: FilterComparator.Includes,
                label: '',
              });
              setSearchField('');
            }}
          />
          <OsdsPopover ref={filterPopoverRef}>
            <OsdsButton
              slot="popover-trigger"
              size={ODS_BUTTON_SIZE.sm}
              color={ODS_THEME_COLOR_INTENT.primary}
              variant={ODS_BUTTON_VARIANT.stroked}
            >
              <OsdsIcon
                name={ODS_ICON_NAME.FILTER}
                size={ODS_ICON_SIZE.xs}
                className="mr-2"
                color={ODS_THEME_COLOR_INTENT.primary}
              />
              {t('pci-common:common_criteria_adder_filter_label')}
            </OsdsButton>
            <OsdsPopoverContent>
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
                  filterPopoverRef.current?.closeSurface();
                }}
              />
            </OsdsPopoverContent>
          </OsdsPopover>
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
    </>
  );
}
