import {
  Datagrid,
  DataGridTextCell,
  FilterAdd,
  FilterList,
  isLocalZone,
  useColumnFilters,
  useDataGrid,
} from '@ovh-ux/manager-react-components';
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
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_RADIO_BUTTON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { usePaginatedInstances } from '@/api/hooks/useInstances';
import StatusComponent from '@/components/new/Status.component';
import NotSupportedTooltipComponent from '@/components/new/NotSupportedTooltip.component';
import { TWorkflowInstance } from '@/types';

const useDatagridColumn = (
  selectedInstance: TWorkflowInstance,
  onSelectInstance: (instance: TWorkflowInstance) => void,
) => {
  const { t } = useTranslation('new');
  return [
    {
      id: 'actions',
      cell: (instance: TWorkflowInstance) => (
        <NotSupportedTooltipComponent region={instance.region}>
          <OsdsRadio
            value={instance.id}
            name="instance"
            disabled={isLocalZone(instance.region)}
            {...(selectedInstance === instance && { checked: true })}
            data-testid={`radio-${instance.id}`}
          >
            <OsdsRadioButton
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_RADIO_BUTTON_SIZE.xs}
              data-testid={`radio-button-${instance.id}`}
              className="mx-auto"
              onClick={() => {
                if (!isLocalZone(instance.region)) {
                  onSelectInstance(instance);
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
      cell: (instance: TWorkflowInstance) => (
        <NotSupportedTooltipComponent region={instance.region}>
          <DataGridTextCell
            className={isLocalZone(instance.region) ? 'opacity-50' : ''}
          >
            {instance.name}
          </DataGridTextCell>
        </NotSupportedTooltipComponent>
      ),
      label: t('pci_projects_project_workflow_instance_name_label'),
    },
    {
      id: 'region',
      cell: (instance: TWorkflowInstance) => (
        <DataGridTextCell
          className={isLocalZone(instance.region) ? 'opacity-50' : ''}
        >
          {instance.regionName}
        </DataGridTextCell>
      ),
      label: t('pci_projects_project_workflow_instance_region_label'),
    },
    {
      id: 'flavorName',
      cell: (instance: TWorkflowInstance) => (
        <DataGridTextCell
          className={isLocalZone(instance.region) ? 'opacity-50' : ''}
        >
          {instance?.flavorName}
        </DataGridTextCell>
      ),
      label: t('pci_projects_project_workflow_instance_flavor_label'),
    },
    {
      id: 'status',
      cell: (instance: TWorkflowInstance) => (
        <StatusComponent
          statusGroup={instance.statusGroup}
          className={
            isLocalZone(instance.region) ? 'opacity-50 mx-auto' : 'mx-auto'
          }
          status={instance.status}
        />
      ),
      label: t('pci_projects_project_workflow_instance_status_label'),
      isSortable: false,
    },
  ];
};

export type ResourceSelectorComponentProps = {
  onSelectInstance: (instance: TWorkflowInstance) => void;
};
export default function ResourceSelectorComponent({
  onSelectInstance,
}: Readonly<ResourceSelectorComponentProps>) {
  const [selectedInstance, setSelectedInstance] = useState<TWorkflowInstance>(
    null,
  );
  const { t } = useTranslation('new');
  const { t: tFilter } = useTranslation('filter');
  const { projectId } = useParams();
  const { pagination, setPagination, sorting, setSorting } = useDataGrid();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const { data: instances, isPending } = usePaginatedInstances(
    projectId,
    {
      pagination,
      sorting,
    },
    filters,
  );
  const filterPopoverRef = useRef(undefined);
  const [searchField, setSearchField] = useState('');
  const columns = useDatagridColumn(selectedInstance, (instance) => {
    setSelectedInstance(instance);
    onSelectInstance(instance);
  });
  return (
    <>
      {!isPending && (
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
      )}
      <div className="my-5">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>
      {isPending && (
        <div className="text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      )}
      {!isPending && (
        <>
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
      )}
    </>
  );
}
