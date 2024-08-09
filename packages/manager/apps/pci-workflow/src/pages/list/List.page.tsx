import { useTranslation } from 'react-i18next';
import {
  OsdsBreadcrumb,
  OsdsButton,
  OsdsChip,
  OsdsDivider,
  OsdsIcon,
  OsdsLink,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { Outlet, useHref, useParams } from 'react-router-dom';
import {
  Datagrid,
  DatagridColumn,
  DataGridTextCell,
  FilterAdd,
  FilterList,
  Headers,
  isDiscoveryProject,
  Notifications,
  PciDiscoveryBanner,
  PciGuidesHeader,
  RedirectionGuard,
  useColumnFilters,
  useDataGrid,
  useDatagridSearchParams,
  useProject,
  useProjectUrl,
} from '@ovhcloud/manager-components';
import { Suspense, useRef, useState } from 'react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_CHIP_VARIANT,
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
  const [searchQueries, setSearchQueries] = useState<string[]>([]);

  const { pagination, setPagination, sorting, setSorting } = useDataGrid();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const { t: tFilter } = useTranslation('filter');
  const projectUrl = useProjectUrl('public-cloud');
  const { data: workflows, isPending } = usePaginatedWorkflows(
    projectId,
    pagination,
    sorting,
    filters,
    searchQueries,
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
      id: 'instanceName',
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
      id: 'cron',
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
          <Actions workflow={workflow} />
        </div>
      ),
      label: '',
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
        <Headers
          title={t('pci_workflow_title')}
          headerButton={<PciGuidesHeader category="kubernetes" />}
        />
      </div>

      <OsdsDivider data-testid="divider" />
      <Notifications />
      <div className="mb-5">
        {project && isDiscoveryProject(project) && (
          <PciDiscoveryBanner
            data-testid="discoveryBanner"
            projectId={projectId}
          />
        )}
      </div>
      <div className="sm:flex items-center justify-between mt-4">
        <OsdsButton
          data-testid="add-button"
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
            data-testid="search-bar"
            className="w-[70%]"
            value={searchField}
            onOdsSearchSubmit={({ detail }) => {
              const { inputValue } = detail;
              if (inputValue) {
                setSearchField('');
                if (searchQueries.indexOf(inputValue) < 0) {
                  setSearchQueries([...searchQueries, inputValue]);
                  setPagination({
                    ...pagination,
                    pageIndex: 0,
                  });
                } else {
                  setSearchQueries([...searchQueries]);
                }
              }
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
                    id: 'instanceName',
                    label: t('pci_workflow_resource'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'cron',
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
      <div className="flex mt-4">
        {searchQueries.map((query, index) => (
          <OsdsChip
            key={index}
            className="mr-2"
            color={ODS_THEME_COLOR_INTENT.primary}
            variant={ODS_CHIP_VARIANT.flat}
            removable
            onOdsChipRemoval={() => {
              setSearchQueries(searchQueries.filter((_, i) => i !== index));
            }}
          >
            {query}
          </OsdsChip>
        ))}
      </div>
      <div className="my-5">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>

      {isPending ? (
        <div className="text-center">
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            data-testid="spinner"
          />
        </div>
      ) : (
        <Datagrid
          columns={columns}
          items={workflows.rows || []}
          totalItems={workflows.totalRows || 0}
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
    </RedirectionGuard>
  );
}
