import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useProject } from '@ovh-ux/manager-pci-common';
import {
  Datagrid,
  FilterAdd,
  FilterList,
  Headers,
  Notifications,
  useColumnFilters,
  useDataGrid,
  useNotifications,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
import { Suspense, useRef, useState } from 'react';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { useL7Policies } from '@/api/hook/useL7Policy';
import { useL7PoliciesDatagridColumn } from '@/pages/detail/listeners/l7/list/useL7PoliciesDatagridColumn';

export default function L7PoliciesList() {
  const { t } = useTranslation('octavia-load-balancer-l7');
  const { t: tFilter } = useTranslation('filter');

  const { projectId, region, listenerId } = useParams();
  const { pagination, setPagination, sorting, setSorting } = useDataGrid();

  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchField, setSearchField] = useState('');
  const filterPopoverRef = useRef(undefined);

  const { paginatedL7Policies, isPending } = useL7Policies(
    projectId,
    listenerId,
    region,
    pagination,
    sorting,
    filters,
  );

  const columns = useL7PoliciesDatagridColumn();

  return (
    <>
      <div className="header mt-8">
        <Headers
          description={t('octavia_load_balancer_list_l7_policies_description')}
          title={t('octavia_load_balancer_list_l7_policies_title')}
        />
      </div>

      <Notifications />

      <div className="sm:flex items-center justify-between mt-4">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
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
            className="mr-2"
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t('octavia_load_balancer_list_l7_policies_add_button')}
        </OsdsButton>

        <div className="justify-between flex">
          <OsdsSearchBar
            className="w-[70%]"
            value={searchField}
            onOdsSearchSubmit={({ detail }) => {
              setPagination({
                pageIndex: 0,
                pageSize: pagination.pageSize,
              });
              addFilter({
                key: 'search',
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
              {tFilter('common_criteria_adder_filter_label')}
            </OsdsButton>
            <OsdsPopoverContent>
              <FilterAdd
                columns={[
                  {
                    id: 'position',
                    label: t('octavia_load_balancer_list_l7_policies_position'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'name',
                    label: t('octavia_load_balancer_list_l7_policies_name'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'action',
                    label: t('octavia_load_balancer_list_l7_policies_action'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'attribute',
                    label: t(
                      'octavia_load_balancer_list_l7_policies_attribute',
                    ),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'redirectHttpCode',
                    label: t(
                      'octavia_load_balancer_list_l7_policies_redirect_code',
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

      <div className="my-5">
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
          items={paginatedL7Policies?.rows || []}
          totalItems={paginatedL7Policies?.totalRows || 0}
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
