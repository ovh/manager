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
  ChangelogButton,
  Datagrid,
  DatagridColumn,
  DataGridTextCell,
  FilterAdd,
  FilterList,
  Headers,
  Notifications,
  PciGuidesHeader,
  RedirectionGuard,
  useColumnFilters,
  useDataGrid,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';
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
import { FilterCategories } from '@ovh-ux/manager-core-api';
import { PciDiscoveryBanner, useProject } from '@ovh-ux/manager-pci-common';
import Actions from '@/components/actions.component';
import {
  TPaginatedWorkflow,
  usePaginatedWorkflows,
} from '@/api/hooks/workflows';
import ExecutionStatusComponent from '@/components/execution-status.component';
import HidePreloader from '@/core/HidePreloader';
import { CHANGELOG_CHAPTERS } from '@/tracking.constants';
import { CHANGELOG_LINKS } from '@/constants';

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

  const columns: DatagridColumn<TPaginatedWorkflow>[] = [
    {
      id: 'name',
      cell: (workflow: TPaginatedWorkflow) => (
        <DataGridTextCell>{workflow.name}</DataGridTextCell>
      ),
      label: t('pci_workflow_name'),
    },
    {
      id: 'id',
      cell: (workflow: TPaginatedWorkflow) => (
        <DataGridTextCell>{workflow.id}</DataGridTextCell>
      ),
      label: t('pci_workflow_id'),
      isSortable: false,
    },
    {
      id: 'type',
      cell: (workflow: TPaginatedWorkflow) => (
        <DataGridTextCell>{workflow.typeLabel}</DataGridTextCell>
      ),
      label: t('pci_workflow_type'),
    },
    {
      id: 'instanceName',
      cell: (workflow: TPaginatedWorkflow) => (
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
      cell: (workflow: TPaginatedWorkflow) => (
        <DataGridTextCell>{workflow.cron}</DataGridTextCell>
      ),
      label: t('pci_workflow_schedule'),
    },
    {
      id: 'lastExecution',
      cell: (workflow: TPaginatedWorkflow) => (
        <DataGridTextCell>{workflow.lastExecution}</DataGridTextCell>
      ),
      label: t('pci_workflow_last_execution'),
    },
    {
      id: 'lastExecutionStatus',
      cell: (workflow: TPaginatedWorkflow) =>
        workflow.lastExecutionStatus ? (
          <ExecutionStatusComponent status={workflow.lastExecutionStatus} />
        ) : null,
      label: t('pci_workflow_last_execution_status'),
      isSortable: false,
    },
    {
      id: 'actions',
      cell: (workflow: TPaginatedWorkflow) => (
        <div className="min-w-16">
          <Actions workflow={workflow} />
        </div>
      ),
      label: '',
      isSortable: false,
    },
  ];

  return (
    <RedirectionGuard
      isLoading={isPending}
      condition={
        !isPending &&
        workflows.rows?.length === 0 &&
        searchQueries.length === 0 &&
        filters?.length === 0
      }
      route={`/pci/projects/${projectId}/workflow/onboarding`}
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
          changelogButton={
            <ChangelogButton
              links={CHANGELOG_LINKS}
              chapters={CHANGELOG_CHAPTERS}
            />
          }
        />
      </div>

      <OsdsDivider data-testid="divider" />
      <Notifications />
      <div className="mb-5">
        <PciDiscoveryBanner data-testid="discoveryBanner" project={project} />
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
                    id: 'typeLabel',
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

      {searchQueries?.length > 0 && (
        <div className="flex mt-8">
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
      )}

      {filters?.length > 0 && (
        <div className="mt-8">
          <FilterList filters={filters} onRemoveFilter={removeFilter} />
        </div>
      )}

      <div className="mt-8" aria-hidden="true"></div>

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
