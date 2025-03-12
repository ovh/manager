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
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { Suspense, useMemo, useRef, useState } from 'react';

import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import OperatingStatusComponent from '@/components/listing/OperatingStatus.component';
import ProvisioningStatusComponent from '@/components/listing/ProvisioningStatus.component';
import ActionsComponent from './Actions.component';
import { TLoadBalancerPool } from '@/api/data/pool';
import DataGridLinkCell from '@/components/datagrid/DataGridLinkCell.component';
import { useLoadBalancerPools } from '@/api/hook/usePool';

export default function PoolList() {
  const { t } = useTranslation(['pools', 'filter', 'load-balancer']);

  const { projectId, region, loadBalancerId } = useParams();
  const { pagination, setPagination, sorting, setSorting } = useDataGrid();

  const navigate = useNavigate();
  const { clearNotifications } = useNotifications();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const filterPopoverRef = useRef(undefined);
  const [searchField, setSearchField] = useState('');

  const { data, error, isPending } = useLoadBalancerPools(
    projectId,
    region,
    loadBalancerId,
    pagination,
    sorting,
    filters,
  );

  const columns: DatagridColumn<TLoadBalancerPool>[] = useMemo(
    () => [
      {
        id: 'name',
        cell: ({ id, name }: TLoadBalancerPool) => (
          <DataGridLinkCell href={`../${id}`}>{name}</DataGridLinkCell>
        ),
        label: t('octavia_load_balancer_pools_name'),
      },
      {
        id: 'protocol',
        cell: (props: TLoadBalancerPool) => (
          <DataGridTextCell>{props.protocol}</DataGridTextCell>
        ),
        label: t('octavia_load_balancer_pools_protocol'),
      },
      {
        id: 'algorithm',
        cell: (props: TLoadBalancerPool) => (
          <DataGridTextCell>
            {t(`octavia_load_balancer_pools_enum_algorithm_${props.algorithm}`)}
          </DataGridTextCell>
        ),
        label: t('octavia_load_balancer_pools_algorithm'),
      },
      {
        id: 'provisioningStatus',
        cell: (props: TLoadBalancerPool) => (
          <ProvisioningStatusComponent
            status={props.provisioningStatus}
            className="w-fit"
          />
        ),
        label: t('load-balancer:octavia_load_balancer_provisioning_status'),
      },
      {
        id: 'operatingStatus',
        cell: (props: TLoadBalancerPool) => (
          <OperatingStatusComponent
            status={props.operatingStatus}
            className="w-fit"
          />
        ),
        label: t('load-balancer:octavia_load_balancer_operating_status'),
        isSortable: false,
      },
      {
        id: 'actions',
        cell: (props: TLoadBalancerPool) => (
          <div className="min-w-16">
            <ActionsComponent pool={props} />
          </div>
        ),
        label: '',
        isSortable: false,
      },
    ],
    [t],
  );

  if (isPending && !error) {
    return (
      <OsdsSpinner
        inline
        size={ODS_SPINNER_SIZE.md}
        data-testid="List-spinner"
      />
    );
  }

  return (
    <div>
      <div className="sm:flex items-center justify-between mt-4">
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
          {t('octavia_load_balancer_pools_add_button')}
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
                    id: 'name',
                    label: t('octavia_load_balancer_pools_name'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'protocol',
                    label: t('octavia_load_balancer_pools_protocol'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'algorithm',
                    label: t('octavia_load_balancer_pools_algorithm'),
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

      <Datagrid
        columns={columns}
        items={data?.rows || []}
        totalItems={data?.totalRows || 0}
        pagination={pagination}
        onPaginationChange={setPagination}
        sorting={sorting}
        onSortChange={setSorting}
        className="overflow-x-visible"
      />

      <Suspense>
        <Outlet />
      </Suspense>
    </div>
  );
}
