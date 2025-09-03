import {
  OdsBreadcrumb,
  OdsBreadcrumbItem,
  OdsButton,
  OdsInput,
  OdsPopover,
} from '@ovhcloud/ods-components/react';
import {
  BaseLayout,
  ChangelogButton,
  Datagrid,
  PciGuidesHeader,
  RedirectionGuard,
  useDataGrid,
  useProjectUrl,
  useColumnFilters,
  FilterAdd,
  FilterList,
  Notifications,
  useProductMaintenance,
  PciMaintenanceBanner,
} from '@ovh-ux/manager-react-components';
import { useProject, PciAnnouncementBanner } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import {
  FilterCategories,
  FilterTypeCategories,
  FilterComparator,
} from '@ovh-ux/manager-core-api';
import { Suspense, useContext, useState } from 'react';
import { Outlet, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useDatagridColumn } from '@/pages/listing/useDatagridColumn';
import { CHANGELOG_LINKS } from '@/constants';
import {
  useAllSnapshots,
  usePaginatedVolumeSnapshot,
} from '@/api/hooks/useSnapshots';
import { useQueryParamNotifications } from '@/hooks/useQueryParamNotifications';

export default function ListingPage() {
  const { t } = useTranslation(['volumes']);

  const { shell } = useContext(ShellContext);

  const { projectId } = useParams();
  const hrefProject = useProjectUrl('public-cloud');
  const { data: project } = useProject();

  const { hasMaintenance, maintenanceURL } = useProductMaintenance(
    projectId || '',
  );
  const columns = useDatagridColumn();
  const [searchField, setSearchField] = useState('');
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const { pagination, setPagination, sorting, setSorting } = useDataGrid({
    id: 'creationDate',
    desc: true,
  });

  useQueryParamNotifications();

  const {
    data: allSnapshots,
    isLoading: isAllSnapshotPending,
  } = useAllSnapshots(project?.project_id);

  const { paginatedSnapshots, isLoading } = usePaginatedVolumeSnapshot(
    projectId,
    pagination,
    sorting,
    filters,
  );

  const onHandleSearch = () => {
    setPagination({
      pageIndex: 0,
      pageSize: pagination.pageSize,
    });
    addFilter({
      key: 'name',
      value: searchField.trim(),
      comparator: FilterComparator.Includes,
      label: '',
    });
    setSearchField('');
  };

  const shouldRedirectToOnBoarding =
    !isAllSnapshotPending && !!allSnapshots && allSnapshots.length === 0;

  return (
    <RedirectionGuard
      condition={shouldRedirectToOnBoarding}
      isLoading={isAllSnapshotPending}
      route="./onboarding"
    >
      <BaseLayout
        breadcrumb={
          <OdsBreadcrumb>
            <OdsBreadcrumbItem
              label={project?.description}
              href={hrefProject}
            />
            <OdsBreadcrumbItem
              label={t('pci_projects_project_storages_snapshots_title')}
              href="#"
            />
          </OdsBreadcrumb>
        }
        header={{
          title: t('pci_projects_project_storages_snapshots_title'),
          headerButton: <PciGuidesHeader category="storage" />,
          changelogButton: <ChangelogButton links={CHANGELOG_LINKS} />,
        }}
      >
        <div className="flex flex-col gap-5">
          <div>
            <Notifications />
            {hasMaintenance && (
              <PciMaintenanceBanner
                maintenanceURL={maintenanceURL}
                productName={t('pci_projects_project_storages_snapshots_title')}
              />
            )}
            <PciAnnouncementBanner projectId={projectId} />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-5">
            <div className="flex flex-col sm:flex-row gap-4">
              <OdsButton
                size="sm"
                color="primary"
                variant="outline"
                className="xs:mb-0.5 sm:mb-0"
                icon="plus"
                label={t('pci_projects_project_storages_snapshots_add_label')}
                onClick={() =>
                  shell?.navigation?.navigateTo?.(
                    'public-cloud',
                    `#/pci/projects/${projectId}/storages/volume-backup/create`,
                    { volumeOption: 'volume_snapshot' },
                  )
                }
              />
            </div>
            <div className="flex justify-center gap-4">
              <OdsInput
                name="searchField"
                className="md:min-w-[15rem]"
                value={searchField}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    onHandleSearch();
                  }
                }}
                onOdsChange={({ detail }) => {
                  if (detail.value != null) {
                    setSearchField(String(detail.value));
                  }
                }}
                data-testid="search-input"
              />
              <OdsButton
                label=""
                icon="magnifying-glass"
                size="sm"
                onClick={onHandleSearch}
                data-testid="search-button"
              />

              <OdsButton
                slot="popover-trigger"
                id="popover-filter"
                size="sm"
                color="primary"
                label={t('common_criteria_adder_filter_label', {
                  ns: 'pci-common',
                })}
                variant="outline"
                icon="filter"
                data-testid="add-filter-btn"
              />

              <OdsPopover triggerId="popover-filter">
                <FilterAdd
                  columns={[
                    {
                      id: 'name',
                      label: t(
                        'pci_projects_project_storages_snapshots_name_label',
                      ),
                      comparators: FilterCategories.String,
                      type: FilterTypeCategories.String,
                    },
                    {
                      id: 'id',
                      label: t(
                        'pci_projects_project_storages_snapshots_id_label',
                      ),
                      comparators: FilterCategories.String,
                      type: FilterTypeCategories.String,
                    },
                    {
                      id: 'region',
                      label: t(
                        'pci_projects_project_storages_snapshots_region_label',
                      ),
                      comparators: FilterCategories.String,
                      type: FilterTypeCategories.String,
                    },
                    {
                      id: 'size',
                      label: t(
                        'pci_projects_project_storages_snapshots_size_label',
                      ),
                      comparators: FilterCategories.Numeric,
                      type: FilterTypeCategories.Numeric,
                    },
                    {
                      id: 'status',
                      label: t(
                        'pci_projects_project_storages_snapshots_status_label',
                      ),
                      comparators: FilterCategories.String,
                      type: FilterTypeCategories.String,
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
                  }}
                />
              </OdsPopover>
            </div>
          </div>
          <div>
            <FilterList filters={filters} onRemoveFilter={removeFilter} />
          </div>

          <div className="overflow-x-auto max-w-full">
            <Datagrid
              columns={columns}
              items={paginatedSnapshots.rows}
              totalItems={paginatedSnapshots.totalRows}
              pagination={pagination}
              onPaginationChange={setPagination}
              sorting={sorting}
              onSortChange={setSorting}
              isLoading={isLoading}
            />
            <Suspense>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </BaseLayout>
    </RedirectionGuard>
  );
}
