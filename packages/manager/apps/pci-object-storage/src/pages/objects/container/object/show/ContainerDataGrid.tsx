import {
  OdsButton,
  OdsText,
  OdsToggle,
  OdsInput,
  OdsPopover,
  OdsSpinner,
} from '@ovhcloud/ods-components/react';
import {
  Datagrid,
  FilterAdd,
  FilterList,
} from '@ovh-ux/manager-react-components';
import { ColumnSort } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { TrackingClickParams } from '@ovh-ux/manager-react-shell-client';

interface ContainerDatagridProps {
  isS3StorageType: boolean;
  isRightOffer: boolean;
  isLocalZone: boolean;
  versioningStatus: string;
  handleAddObjectClick: () => void;
  enableVersionsToggle: boolean;
  setEnableVersionsToggle: (value: boolean) => void;
  objectsColumns: any[];
  sortingDatagrid: ColumnSort | null;
  setSortingDatagrid: (sorting: ColumnSort | null) => void;
  hasNextPage: boolean;
  isObjectsLoading: boolean;
  containerObjectsWithIndex: any[];
  containerObjects: any[];
  handleFetchNextPage: () => void;
  search: string | null;
  setSearch: (value: string | null) => void;
  handlePrefixChange: (value: string | null) => void;
  filterColumns: any[];
  searchField: string;
  setSearchField: (value: string) => void;
  handleSearch: () => void;
  filters: any[];
  removeFilter: (filter: any) => void;
  isPending: boolean;
  columns: any[];
  paginatedObjects: any;
  pagination: any;
  setPagination: (pagination: any) => void;
  sorting: any;
  setSorting: (sorting: any) => void;
  addFilter: (filter: any) => void;
  shouldHideButton: boolean;
  hasStandardInfrequentAccess: boolean;
  trackClick: ({
    location,
    buttonType,
    actions,
    actionType,
  }: TrackingClickParams) => void;

  trackAction: (
    actionType: 'page' | 'funnel',
    specificAction: string,
  ) => {
    actions: string[];
  };
}

export function ContainerDatagrid({
  isS3StorageType,
  isRightOffer,
  isLocalZone,
  versioningStatus,
  handleAddObjectClick,
  setEnableVersionsToggle,
  objectsColumns,
  sortingDatagrid,
  setSortingDatagrid,
  hasNextPage,
  isObjectsLoading,
  containerObjectsWithIndex,
  containerObjects,
  handleFetchNextPage,
  search,
  setSearch,
  handlePrefixChange,
  filterColumns,
  searchField,
  setSearchField,
  handleSearch,
  filters,
  removeFilter,
  isPending,
  columns,
  paginatedObjects,
  pagination,
  setPagination,
  sorting,
  setSorting,
  addFilter,
  shouldHideButton,
  hasStandardInfrequentAccess,
  trackClick,
  trackAction,
}: ContainerDatagridProps) {
  const { t } = useTranslation(['container', 'filters']);

  if (isS3StorageType) {
    return (
      <div className="mt-9 container-data-grid">
        <OdsText preset="heading-4" className="mt-6 block">
          {t(
            'container:pci_projects_project_storages_containers_container_objects',
          )}
        </OdsText>
        <OdsText preset="paragraph" className="mt-4 block mb-6">
          {t(
            'container:pci_projects_project_storages_containers_container_objects_sort_warining',
          )}
        </OdsText>
        <Datagrid
          topbar={
            <div className="flex w-full justify-between items-center">
              {hasStandardInfrequentAccess ? (
                <OdsButton
                  onClick={handleAddObjectClick}
                  label={t(
                    `container:pci_projects_project_storages_containers_container_add_object_label`,
                  )}
                  icon="plus"
                  size="sm"
                />
              ) : (
                shouldHideButton && (
                  <OdsButton
                    onClick={handleAddObjectClick}
                    label={t(
                      `container:pci_projects_project_storages_containers_container_add_object_label`,
                    )}
                    icon="plus"
                    size="sm"
                  />
                )
              )}

              <div className="flex justify-center gap-4 ml-auto mr-0 md:mr-5">
                {isRightOffer &&
                  !isLocalZone &&
                  versioningStatus !== 'disabled' && (
                    <>
                      <OdsText>
                        {t(
                          'container:pci_projects_project_storages_containers_container_show_versions',
                        )}
                      </OdsText>
                      <OdsToggle
                        class="my-toggle"
                        name="enableVersionsToggle"
                        onOdsChange={({ detail }) => {
                          setEnableVersionsToggle(detail.value as boolean);
                          trackClick(
                            trackAction('page', 'switch-to-see-versioning'),
                          );
                        }}
                      />
                    </>
                  )}
              </div>
            </div>
          }
          columns={objectsColumns}
          sorting={sortingDatagrid}
          onSortChange={setSortingDatagrid}
          hasNextPage={hasNextPage}
          items={isObjectsLoading ? [] : containerObjectsWithIndex}
          onFetchNextPage={handleFetchNextPage}
          totalItems={containerObjects?.length}
          isLoading={isObjectsLoading}
          search={{
            searchInput: search,
            setSearchInput: setSearch,
            onSearch: handlePrefixChange,
          }}
        />
      </div>
    );
  }

  return (
    <>
      <div className="sm:flex items-center justify-between mt-8">
        {hasStandardInfrequentAccess ? (
          <OdsButton
            onClick={handleAddObjectClick}
            label={t(
              `container:pci_projects_project_storages_containers_container_add_object_label`,
            )}
            icon="plus"
            size="sm"
          />
        ) : (
          shouldHideButton && (
            <OdsButton
              onClick={handleAddObjectClick}
              label={t(
                `container:pci_projects_project_storages_containers_container_add_object_label`,
              )}
              icon="plus"
              size="sm"
            />
          )
        )}

        <div className="flex justify-center gap-4 ml-auto">
          <OdsInput
            name="searchField"
            className="min-w-[15rem]"
            value={searchField}
            onOdsChange={({ detail }) => setSearchField(detail.value as string)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleSearch();
              }
            }}
          />
          <OdsButton
            label=""
            icon="magnifying-glass"
            size="sm"
            onClick={handleSearch}
          />
          <OdsButton
            id="filterPopoverTrigger"
            size="sm"
            color="primary"
            label={t('filters:common_criteria_adder_filter_label')}
            variant="outline"
            icon="filter"
          />
          <OdsPopover triggerId="filterPopoverTrigger">
            <FilterAdd
              columns={filterColumns}
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

      <div className="mt-8">
        <FilterList filters={filters} onRemoveFilter={removeFilter} />
      </div>
      <div className="mt-8">
        {isPending ? (
          <OdsSpinner />
        ) : (
          <Datagrid
            columns={columns}
            items={paginatedObjects?.rows || []}
            totalItems={paginatedObjects?.totalRows || 0}
            pagination={pagination}
            onPaginationChange={setPagination}
            sorting={sorting}
            onSortChange={setSorting}
            className="overflow-x-visible"
          />
        )}
      </div>
    </>
  );
}
