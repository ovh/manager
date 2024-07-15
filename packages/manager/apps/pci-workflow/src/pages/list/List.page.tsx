import { useTranslation } from 'react-i18next';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsDivider,
  OsdsIcon,
  OsdsLink,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { Outlet, useHref, useParams } from 'react-router-dom';
import {
  Datagrid,
  DatagridColumn,
  DataGridTextCell,
  FilterAdd,
  FilterList,
  isDiscoveryProject,
  Notifications,
  PciDiscoveryBanner,
  PciGuidesHeader,
  RedirectionGuard,
  useColumnFilters,
  useDataGrid,
  useProject,
  useProjectUrl,
} from '@ovhcloud/manager-components';
import { Suspense, useRef, useState } from 'react';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_SPINNER_SIZE,
} from '@ovhcloud/ods-components';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import Actions from '@/components/actions.component';
import HidePreloader from '../../core/HidePreloader';
import { TWorkflow, usePaginatedWorkflows } from '@/api/hooks/workflows';
import ExecutionStatusComponent from '@/components/execution-status.component';

export default function ListingPage() {
  const { t } = useTranslation('listing');
  const { projectId } = useParams();
  const { data: project } = useProject(projectId || '');
  const hrefAdd = useHref(`./new`);
  const [searchField, setSearchField] = useState('');
  const filterPopoverRef = useRef(undefined);
  const { pagination, setPagination } = useDataGrid();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const { t: tFilter } = useTranslation('filter');
  const projectUrl = useProjectUrl('public-cloud');
  const { data: workflows, isPending } = usePaginatedWorkflows(
    projectId,
    pagination,
    filters,
  );

  const columns: DatagridColumn<TWorkflow>[] = [
    {
      id: 'name',
      cell: (workflow: TWorkflow) => (
        <DataGridTextCell>{workflow.name}</DataGridTextCell>
      ),
      label: t('pci_workflow_name'),
    },
    {
      id: 'id',
      cell: (workflow: TWorkflow) => (
        <DataGridTextCell>{workflow.id}</DataGridTextCell>
      ),
      label: t('pci_workflow_id'),
    },
    {
      id: 'type',
      cell: () => (
        <DataGridTextCell>
          {t('pci_workflow_type_instance_backup_title')}
        </DataGridTextCell>
      ),
      label: t('pci_workflow_type'),
    },
    {
      id: 'resource',
      cell: (workflow: TWorkflow) => (
        <OsdsLink
          color={ODS_THEME_COLOR_INTENT.primary}
          href={`${projectUrl}/instances/${workflow.instanceId}`}
        >
          {workflow.instanceName}
        </OsdsLink>
      ),
      label: t('pci_workflow_resource'),
    },
    {
      id: 'schedule',
      cell: (workflow: TWorkflow) => (
        <DataGridTextCell>{workflow.cron}</DataGridTextCell>
      ),
      label: t('pci_workflow_schedule'),
    },
    {
      id: 'lastExecution',
      cell: (workflow: TWorkflow) => (
        <DataGridTextCell>{workflow.lastExecution}</DataGridTextCell>
      ),
      label: t('pci_workflow_last_execution'),
    },
    {
      id: 'lastExecutionStatus',
      cell: (workflow: TWorkflow) =>
        workflow.lastExecutionStatus ? (
          <ExecutionStatusComponent status={workflow.lastExecutionStatus} />
        ) : null,
      label: t('pci_workflow_last_execution_status'),
    },
    {
      id: 'actions',
      cell: (workflow: TWorkflow) => (
        <div className="min-w-16">
          <Actions
            backupId={workflow.id}
            isExecutionsAvailable={
              Array.isArray(workflow?.executions) &&
              workflow?.executions.length > 0
            }
          />
        </div>
      ),
      label: t(''),
    },
  ];

  return (
    <RedirectionGuard
      isLoading={isPending}
      route={`/pci/projects/${projectId}/workflow/onboarding`}
      condition={workflows.totalRows === 0}
    >
      <HidePreloader />
      {project && (
        <OsdsBreadcrumb
          items={[
            {
              href: projectUrl,
              label: project.description,
            },
            {
              label: t('pci_workflow_title'),
            },
          ]}
        />
      )}
      <div className="header mb-6 mt-8">
        <div className="flex items-center justify-between">
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.heading}
            size={ODS_THEME_TYPOGRAPHY_SIZE._600}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            {t('pci_workflow_title')}
          </OsdsText>
          <PciGuidesHeader category="kubernetes"></PciGuidesHeader>
        </div>
      </div>

      <OsdsDivider></OsdsDivider>
      <Notifications />
      <div className="mb-5">
        {project && isDiscoveryProject(project) && (
          <PciDiscoveryBanner projectId={projectId} />
        )}
      </div>
      <div className="sm:flex items-center justify-between mt-4">
        <OsdsButton
          size={ODS_BUTTON_SIZE.sm}
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          className="xs:mb-0.5 sm:mb-0"
          href={hrefAdd}
        >
          <OsdsIcon
            size={ODS_ICON_SIZE.xs}
            name={ODS_ICON_NAME.PLUS}
            className="mr-2"
            color={ODS_THEME_COLOR_INTENT.primary}
          />
          {t('pci_workflow_add')}
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
                    id: 'name',
                    label: t('pci_workflow_name'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'id',
                    label: t('pci_workflow_id'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'type',
                    label: t('pci_workflow_type'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'resource',
                    label: t('pci_workflow_resource'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'schedule',
                    label: t('pci_workflow_schedule'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'lastExecution',
                    label: t('pci_workflow_last_execution'),
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
        <div className="text-center">
          <OsdsSpinner inline size={ODS_SPINNER_SIZE.md} />
        </div>
      ) : (
        <Datagrid
          columns={columns}
          items={workflows.rows || []}
          totalItems={workflows.totalRows || 0}
          pagination={pagination}
          onPaginationChange={setPagination}
          className="overflow-x-visible"
        />
      )}
      <Suspense>
        <Outlet />
      </Suspense>
    </RedirectionGuard>
  );
}
