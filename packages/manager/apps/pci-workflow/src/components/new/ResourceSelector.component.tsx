import {
  Datagrid,
  DataGridTextCell,
  FilterAdd,
  FilterList,
  isLocalZone,
  useColumnFilters,
  useDataGrid,
} from '@ovhcloud/manager-components';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useRef, useState } from 'react';
import {
  OsdsButton,
  OsdsIcon,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsRadio,
  OsdsRadioButton,
  OsdsSearchBar,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_RADIO_BUTTON_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { useInstances } from '@/api/hooks/useInstances';
import { TInstance } from '@/type';
import StatusComponent from '@/components/new/Status.component';
import NotSupportedTooltipComponent from '@/components/new/NotSupportedTooltip.component';

const useDatagridColumn = (
  selectedInstancesId: string,
  onSelectInstance: (instanceId: string) => void,
) => {
  const { t } = useTranslation('new');
  return [
    {
      id: 'actions',
      cell: (props: TInstance) => (
        <NotSupportedTooltipComponent region={props.region}>
          <OsdsRadio
            value={props.id}
            name="instance"
            disabled={isLocalZone(props.region)}
            {...(selectedInstancesId === props.id && { checked: true })}
          >
            <OsdsRadioButton
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_RADIO_BUTTON_SIZE.xs}
              onClick={() => {
                if (!isLocalZone(props.region)) {
                  onSelectInstance(props.id);
                }
              }}
            />
          </OsdsRadio>
        </NotSupportedTooltipComponent>
      ),
      label: '',
    },
    {
      id: 'name',
      cell: (props: TInstance) => (
        <NotSupportedTooltipComponent region={props.region}>
          <DataGridTextCell
            className={isLocalZone(props.region) ? 'opacity-50' : ''}
          >
            {props.name}
          </DataGridTextCell>
        </NotSupportedTooltipComponent>
      ),
      label: t('pci_projects_project_workflow_instance_name_label'),
    },
    {
      id: 'region',
      cell: (props: TInstance) => (
        <DataGridTextCell
          className={isLocalZone(props.region) ? 'opacity-50' : ''}
        >
          {props.regionName}
        </DataGridTextCell>
      ),
      label: t('pci_projects_project_workflow_instance_region_label'),
    },
    {
      id: 'flavorName',
      cell: (props: TInstance) => (
        <DataGridTextCell
          className={isLocalZone(props.region) ? 'opacity-50' : ''}
        >
          {props?.flavorName}
        </DataGridTextCell>
      ),
      label: t('pci_projects_project_workflow_instance_flavor_label'),
    },
    {
      id: 'status',
      cell: (props: TInstance) => (
        <StatusComponent
          statusGroup={props.statusGroup}
          className={isLocalZone(props.region) ? 'opacity-50' : ''}
          status={props.status}
        />
      ),
      label: t('pci_projects_project_workflow_instance_status_label'),
    },
  ];
};

export type ResourceSelectorComponentProps = {
  selectedInstancesId: string;
  onSelectInstance: (instanceId: string) => void;
};
export default function ResourceSelectorComponent({
  selectedInstancesId,
  onSelectInstance,
}: Readonly<ResourceSelectorComponentProps>) {
  const { t } = useTranslation('new');
  const { t: tFilter } = useTranslation('filter');
  const { projectId } = useParams();
  const { pagination, setPagination, sorting, setSorting } = useDataGrid();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const { data: instances } = useInstances(
    projectId,
    {
      pagination,
      sorting,
    },
    filters,
  );
  const filterPopoverRef = useRef(undefined);
  const [searchField, setSearchField] = useState('');
  const columns = useDatagridColumn(selectedInstancesId, onSelectInstance);
  return (
    <>
      <div className="sm:flex items-center justify-end mt-4">
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
                    label: t(
                      'pci_projects_project_workflow_instance_name_label',
                    ),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'flavorName',
                    label: t(
                      'pci_projects_project_workflow_instance_flavor_label',
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
      <Datagrid
        columns={columns}
        items={instances?.rows || []}
        totalItems={instances?.totalRows || 0}
        pagination={pagination}
        sorting={sorting}
        onSortChange={setSorting}
        onPaginationChange={setPagination}
      />
    </>
  );
}
