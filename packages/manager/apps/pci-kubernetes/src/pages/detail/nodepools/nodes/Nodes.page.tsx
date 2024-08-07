import { Outlet, useParams } from 'react-router-dom';
import { useMemo, useRef, useState } from 'react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
  ODS_TEXT_COLOR_INTENT,
  ODS_TEXT_LEVEL,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useProject } from '@ovh-ux/manager-pci-common';
import {
  Datagrid,
  FilterAdd,
  FilterList,
  Notifications,
  useColumnFilters,
  useDataGrid,
} from '@ovhcloud/manager-components';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { useClusterNodePools } from '@/api/hooks/node-pools';
import { useDatagridColumns } from './useDatagridColumns';
import { usePaginatedNodes } from '@/api/hooks/nodes';

export default function NodesPage(): JSX.Element {
  const { projectId, kubeId, poolId } = useParams();
  const { data: project } = useProject(projectId);
  const { data: pools } = useClusterNodePools(projectId, kubeId);
  const { t: tKubeNodes } = useTranslation('kube-nodes');
  const { t: tFilter } = useTranslation('filter');
  const { t: tListing } = useTranslation('listing');

  const [searchField, setSearchField] = useState('');
  const filterPopoverRef = useRef(undefined);
  const { pagination, setPagination } = useDataGrid();
  const columns = useDatagridColumns();
  const { filters, addFilter, removeFilter } = useColumnFilters();

  const pool = useMemo(() => (pools || []).find((p) => p.id === poolId), [
    pools,
  ]);

  const { data: nodes, isPending: isNodesPending } = usePaginatedNodes(
    projectId,
    kubeId,
    poolId,
    pagination,
    filters,
  );

  const refresh = () => {
    // TODO implement inavlidate nodes query
  };

  return (
    <>
      <OsdsText
        color={ODS_TEXT_COLOR_INTENT.text}
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_THEME_TYPOGRAPHY_SIZE._700}
      >
        {pool?.name}
      </OsdsText>
      <Notifications />
      <p>
        <OsdsText
          color={ODS_TEXT_COLOR_INTENT.text}
          level={ODS_TEXT_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
        >
          {tKubeNodes('kube_nodes_description_project_1', {
            description: project?.description,
          })}
        </OsdsText>
      </p>
      <div className="sm:flex items-center justify-between mt-4">
        <div className="flex flex-row">
          <OsdsButton
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
              {tFilter('common_criteria_adder_filter_label')}
            </OsdsButton>
            <OsdsPopoverContent>
              <FilterAdd
                columns={[
                  {
                    id: 'name',
                    label: tKubeNodes('kube_nodes_name'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'id',
                    label: tListing('kube_list_id'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'flavor',
                    label: tKubeNodes('kube_nodes_flavor'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'billingType',
                    label: tKubeNodes('kube_nodes_billing_type'),
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
      {isNodesPending ? (
        <div className="text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      ) : (
        <div>
          <Datagrid
            columns={columns}
            items={nodes?.rows || []}
            totalItems={nodes?.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            className="overflow-x-visible"
          />
        </div>
      )}

      <Outlet />
    </>
  );
}
