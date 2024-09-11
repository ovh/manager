import { Outlet, useNavigate, useParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import {
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
} from '@ovhcloud/ods-components';
import {
  Datagrid,
  FilterAdd,
  FilterList,
  Notifications,
  useColumnFilters,
  useDataGrid,
} from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { useTranslation } from 'react-i18next';
import { usePaginatedClusterNodePools } from '@/api/hooks/node-pools';
import { useDatagridColumns } from '@/pages/detail/nodepools/useDatagridColumn';
import queryClient from '@/queryClient';
import LoadingSkeleton from '@/components/LoadingSkeleton.component';

export default function NodePoolsPage() {
  const { projectId, kubeId } = useParams();
  const [searchField, setSearchField] = useState('');
  const { t: tNodesPool } = useTranslation('node-pool');
  const { t: tFilter } = useTranslation('filter');
  const { t: tKubeNodes } = useTranslation('kube-nodes');
  const filterPopoverRef = useRef(undefined);
  const navigate = useNavigate();

  const { pagination, setPagination, sorting, setSorting } = useDataGrid();
  const columns = useDatagridColumns();
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const {
    data: pools,
    isPending: isPoolsPending,
  } = usePaginatedClusterNodePools(
    projectId,
    kubeId,
    pagination,
    filters,
    sorting,
  );

  const refresh = async () =>
    queryClient.invalidateQueries({
      queryKey: ['project', projectId, 'kubernetes', kubeId, 'nodePools'],
    });

  return (
    <>
      <Notifications />
      <div className="sm:flex items-center justify-between mt-4">
        <div className="flex flex-row">
          <OsdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="xs:mb-0.5 sm:mb-0"
            onClick={() => {
              navigate('./new');
            }}
          >
            {tNodesPool('kube_node_pool_add')}
          </OsdsButton>
          <OsdsButton
            data-testid="refresh-button"
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.stroked}
            color={ODS_THEME_COLOR_INTENT.primary}
            className="xs:mb-0.5 sm:mb-0 ml-0.5"
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
        </div>

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
                    id: 'name',
                    label: tNodesPool('kube_node_pool_name'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'flavor',
                    label: tKubeNodes('kube_nodes_flavor'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'autoscale',
                    label: 'Autoscaling',
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'monthlyBilled',
                    label: tNodesPool('kube_node_pool_monthly_billing'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'createdAt',
                    label: tNodesPool('kube_node_pool_creation_date'),
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

      <LoadingSkeleton when={!isPoolsPending}>
        <div>
          <Datagrid
            columns={columns}
            items={pools?.rows || []}
            totalItems={pools?.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortChange={setSorting}
            className="overflow-x-visible"
          />
        </div>
      </LoadingSkeleton>
      <Outlet />
    </>
  );
}
