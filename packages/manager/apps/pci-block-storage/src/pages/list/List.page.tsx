import { Suspense, useRef, useState } from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsBreadcrumb,
  OsdsPopover,
  OsdsPopoverContent,
  OsdsSearchBar,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { FilterCategories, FilterComparator } from '@ovh-ux/manager-core-api';
import { PciAnnouncementBanner, useParam, useProject } from '@ovh-ux/manager-pci-common';
import {
  ChangelogButton,
  Datagrid,
  FilterAdd,
  FilterList,
  Headers,
  Notifications,
  PageLayout,
  useColumnFilters,
  useDataGrid,
  useProjectUrl,
} from '@ovh-ux/manager-react-components';

import { useAllVolumes, useVolumes } from '@/api/hooks/useVolume';
import { FileStorageAlphaBanner } from '@/components/banner/FileStorageAlphaBanner.component';
import { ButtonLink } from '@/components/button-link/ButtonLink';
import { Button } from '@/components/button/Button';
import { CHANGELOG_LINKS } from '@/constants';
import { useDatagridColumn } from '@/hooks/useDatagridColumn';
import { StorageGuidesHeader } from '@/pages/list/StorageGuidesHeader.component';

export const ListingPage = () => {
  const { t } = useTranslation(['common', NAMESPACES.ACTIONS]);
  const projectUrl = useProjectUrl('public-cloud');

  const { projectId } = useParam('projectId');
  const columns = useDatagridColumn(projectId, projectUrl);
  const [searchField, setSearchField] = useState('');
  const { data: project } = useProject();
  const { filters, addFilter, removeFilter } = useColumnFilters();
  const filterPopoverRef = useRef<HTMLOsdsPopoverElement>(null);

  const { pagination, setPagination, sorting, setSorting } = useDataGrid();

  const { data: allVolumes } = useAllVolumes(projectId);
  const {
    data: volumes,
    error,
    isFetching,
    isPending,
    refetch,
  } = useVolumes(
    projectId,
    {
      pagination,
      sorting,
    },
    filters,
  );

  if (allVolumes && !allVolumes.length && !isFetching) return <Navigate to="./onboarding" />;

  return (
    <PageLayout>
      <div className="mb-6">
        <OsdsBreadcrumb
          items={[
            {
              href: projectUrl,
              label: project?.description,
            },
            {
              label: t('pci_projects_project_storages_blocks_title'),
            },
          ]}
        />
      </div>
      <Headers
        title={t('pci_projects_project_storages_blocks_title')}
        headerButton={<StorageGuidesHeader />}
        changelogButton={<ChangelogButton links={CHANGELOG_LINKS} />}
      />
      <FileStorageAlphaBanner />
      <div className="my-5 max-w-[800px]">
        <PciAnnouncementBanner />

        <Notifications />
      </div>
      <div className="flex items-center flex-wrap justify-between mt-4 gap-y-2">
        <ButtonLink
          to="./new"
          color="primary"
          size="sm"
          actionName="create_volume_block_storage"
          location="page"
          icon="plus"
        >
          {t('pci_projects_project_storages_blocks_add_label')}
        </ButtonLink>

        <div className="justify-between flex gap-5 items-center">
          <div className="flex items-center">
            {isFetching ? (
              <OsdsSpinner inline size={ODS_SPINNER_SIZE.sm} />
            ) : (
              <Button
                size="sm"
                color="primary"
                variant="outline"
                onClick={() => void refetch()}
                icon="refresh"
                aria-label={t('refresh', { ns: NAMESPACES.ACTIONS })}
              />
            )}
          </div>
          <OsdsSearchBar
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
            <Button
              slot="popover-trigger"
              size="sm"
              color="primary"
              variant="outline"
              icon="filter"
            >
              {t('filter', { ns: NAMESPACES.ACTIONS })}
            </Button>
            <OsdsPopoverContent>
              <FilterAdd
                columns={[
                  {
                    id: 'name',
                    label: t('pci_projects_project_storages_blocks_name_label'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'id',
                    label: t('pci_projects_project_storages_blocks_id_label'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'regionName',
                    label: t('pci_projects_project_storages_blocks_region_label'),
                    comparators: FilterCategories.String,
                  },
                  {
                    id: 'size',
                    label: t('pci_projects_project_storages_blocks_size_label'),
                    comparators: FilterCategories.Numeric,
                  },
                  {
                    id: 'status',
                    label: t('pci_projects_project_storages_blocks_status_label'),
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
                  void filterPopoverRef.current?.closeSurface();
                }}
              />
            </OsdsPopoverContent>
          </OsdsPopover>
        </div>
      </div>
      <div className="my-5">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>
      {!isPending && !error && (
        <div className="mt-8">
          <Datagrid
            columns={columns}
            items={volumes?.rows || []}
            totalItems={volumes?.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            className="overflow-x-visible"
            sorting={sorting}
            onSortChange={setSorting}
          />
        </div>
      )}
      <Suspense>
        <Outlet />
      </Suspense>
    </PageLayout>
  );
};

export default ListingPage;
