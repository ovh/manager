import { useTranslation } from 'react-i18next';

import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_RADIO_BUTTON_SIZE } from '@ovhcloud/ods-components';
import { OsdsRadioButton } from '@ovhcloud/ods-components/react';

import { FilterCategories } from '@ovh-ux/manager-core-api';
import {
  DataGridTextCell,
  DatagridColumn,
  useColumnFilters,
  useDataGrid,
} from '@ovh-ux/manager-react-components';

import { TInstance } from '@/api/hooks/instance/selector/instances.selector';
import { usePaginatedInstances } from '@/api/hooks/instance/usePaginatedInstances';
import { isSameResource } from '@/api/hooks/resource';
import { TWorkflowSelectedResource } from '@/api/hooks/workflows';
import NotSupportedTooltipComponent from '@/components/new/NotSupportedTooltip.component';
import StatusComponent from '@/components/new/Status.component';
import { useSafeParam } from '@/hooks/useSafeParam';
import { ResourceSelector } from '@/pages/new/components/ResourceSelector';

const useDatagridColumn = (
  selectedInstance: TWorkflowSelectedResource | null,
  onSelectInstance: (instance: TInstance) => void,
) => {
  const { t } = useTranslation('new');
  return [
    {
      id: 'actions',
      cell: (resource) => (
        <div className="text-center">
          <NotSupportedTooltipComponent supported={resource.autoBackup}>
            <OsdsRadioButton
              checked={
                (!!selectedInstance && isSameResource(selectedInstance, resource.id)) || undefined
              }
              color={ODS_THEME_COLOR_INTENT.primary}
              size={ODS_RADIO_BUTTON_SIZE.xs}
              data-testid={`radio-button-${resource.label}`}
              disabled={!resource.autoBackup || undefined}
              className="mx-auto"
              onClick={() => {
                if (resource.autoBackup) {
                  onSelectInstance(resource);
                }
              }}
            />
          </NotSupportedTooltipComponent>
        </div>
      ),
      label: '',
    },
    {
      id: 'name',
      cell: (resource) => (
        <NotSupportedTooltipComponent supported={resource.autoBackup}>
          <DataGridTextCell>{resource.name}</DataGridTextCell>
        </NotSupportedTooltipComponent>
      ),
      label: t('pci_projects_project_workflow_instance_name_label'),
    },
    {
      id: 'region',
      cell: (instance) => <DataGridTextCell>{instance.region.label}</DataGridTextCell>,
      label: t('pci_projects_project_workflow_instance_region_label'),
    },
    {
      id: 'flavor',
      cell: (instance) => <DataGridTextCell>{instance.flavor}</DataGridTextCell>,
      label: t('pci_projects_project_workflow_instance_flavor_label'),
    },
    {
      id: 'status',
      cell: (instance) => (
        <StatusComponent
          statusGroup={instance.status.group}
          className="mx-auto"
          status={instance.status.name}
        />
      ),
      label: t('pci_projects_project_workflow_instance_status_label'),
      isSortable: false,
    },
  ] satisfies DatagridColumn<TInstance>[];
};

export type InstanceSelectorComponentProps = {
  selectedInstance: TWorkflowSelectedResource | null;
  onSelectInstance: (instance: TInstance) => void;
};
export const InstanceSelectorComponent = ({
  selectedInstance,
  onSelectInstance,
}: Readonly<InstanceSelectorComponentProps>) => {
  const { t } = useTranslation('new');
  const projectId = useSafeParam('projectId');

  const paginationAndSorting = useDataGrid();
  const filtering = useColumnFilters();

  const { data: instances, isPending } = usePaginatedInstances(
    projectId,
    {
      pagination: paginationAndSorting.pagination,
      sorting: paginationAndSorting.sorting,
    },
    filtering.filters,
  );

  console.log(filtering.filters);

  const columns = useDatagridColumn(selectedInstance, onSelectInstance);
  const columnToFilter = [
    {
      id: 'name',
      label: t('new:pci_projects_project_workflow_instance_name_label'),
      comparators: FilterCategories.String,
    },
    {
      id: 'flavorName',
      label: t('new:pci_projects_project_workflow_instance_flavor_label'),
      comparators: FilterCategories.String,
    },
  ];

  return (
    <ResourceSelector
      resources={instances}
      columns={columns}
      paginationAndSorting={paginationAndSorting}
      filtering={{ ...filtering, columnToFilter }}
      isPending={isPending}
    />
  );
};
