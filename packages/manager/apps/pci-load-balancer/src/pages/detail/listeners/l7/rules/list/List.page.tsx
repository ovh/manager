import {
  Datagrid,
  FilterAdd,
  FilterList,
  useColumnFilters,
  useDataGrid,
  useNotifications,
  DatagridColumn,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import {
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
import { Suspense, useMemo, useRef, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';
import ActionsComponent from '@/pages/detail/listeners/l7/rules/list/Actions.component';
import { TL7Rule } from '@/api/data/l7Rules';
import { useL7Rules } from '@/api/hook/useL7Rule';

export default function L7RulesList() {
  const { t } = useTranslation(['l7/rules/list', 'load-balancer', 'filter']);

  const { projectId, region, policyId } = useParams();
  const { pagination, setPagination, sorting, setSorting } = useDataGrid();

  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const [searchField, setSearchField] = useState('');
  const filterPopoverRef = useRef(undefined);

  const { paginatedL7Rules, isPending } = useL7Rules(
    projectId,
    policyId,
    region,
    pagination,
    sorting,
    filters,
  );

  const columns: DatagridColumn<TL7Rule>[] = useMemo(
    () => [
      {
        id: 'ruleType',
        cell: (props: TL7Rule) => (
          <DataGridTextCell>{props.ruleType}</DataGridTextCell>
        ),
        label: t('octavia_load_balancer_list_l7_rules_type'),
      },
      {
        id: 'compareType',
        cell: (props: TL7Rule) => (
          <DataGridTextCell>{props.compareType}</DataGridTextCell>
        ),
        label: t('octavia_load_balancer_list_l7_rules_comparison_type'),
      },
      {
        id: 'key',
        cell: (props: TL7Rule) => (
          <DataGridTextCell>{props.key}</DataGridTextCell>
        ),
        label: t('octavia_load_balancer_list_l7_rules_key'),
      },
      {
        id: 'value',
        cell: (props: TL7Rule) => (
          <DataGridTextCell>{props.value}</DataGridTextCell>
        ),
        label: t('octavia_load_balancer_list_l7_rules_value'),
      },
      {
        id: 'invert',
        cell: (props: TL7Rule) => (
          <DataGridTextCell>
            {props.invert ? (
              <OsdsIcon
                name={ODS_ICON_NAME.CHECK}
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_ICON_SIZE.xxs}
              />
            ) : (
              '-'
            )}
          </DataGridTextCell>
        ),
        label: t('octavia_load_balancer_list_l7_rules_invert'),
      },
      {
        id: 'provisioningStatus',
        cell: (props: TL7Rule) => (
          <ProvisioningStatusComponent
            status={props.provisioningStatus}
            className="w-fit"
          />
        ),
        label: t('load-balancer:octavia_load_balancer_provisioning_status'),
      },
      {
        id: 'operatingStatus',
        cell: (props: TL7Rule) => (
          <OperatingStatusComponent
            status={props.operatingStatus}
            className="w-fit"
          />
        ),
        label: t('load-balancer:octavia_load_balancer_operating_status'),
      },
      {
        id: 'actions',
        cell: (props: TL7Rule) => (
          <div className="min-w-16">
            <ActionsComponent l7RulesId={props.id} />
          </div>
        ),
        label: '',
        isSortable: false,
      },
    ],
    [t],
  );

  return (
    <>
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
          {t('octavia_load_balancer_list_l7_rules_add_button')}
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
              {t('filter:common_criteria_adder_filter_label')}
            </OsdsButton>
            <OsdsPopoverContent>
              <FilterAdd
                columns={[
                  {
                    id: 'ruleType',
                    label: t('octavia_load_balancer_list_l7_rules_type'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'compareType',
                    label: t(
                      'octavia_load_balancer_list_l7_rules_comparison_type',
                    ),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'key',
                    label: t('octavia_load_balancer_list_l7_rules_key'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'value',
                    label: t('octavia_load_balancer_list_l7_rules_value'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'invert',
                    label: t('octavia_load_balancer_list_l7_rules_invert'),
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
          items={paginatedL7Rules?.rows || []}
          totalItems={paginatedL7Rules?.totalRows || 0}
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
