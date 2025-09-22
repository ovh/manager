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
import { useTranslation } from 'react-i18next';
import {
  useS3ContainerContext,
  useSwiftContainerContext,
} from './ContainerContext';

export type ContainerDatagridProps = {
  isS3StorageType: boolean;
  handleAddObjectClick: () => void;
};

export function ContainerDatagrid({
  isS3StorageType,
  handleAddObjectClick,
}: ContainerDatagridProps) {
  const { t } = useTranslation(['container', 'filters']);
  const s3Context = useS3ContainerContext();
  const swiftContext = useSwiftContainerContext();

  if (isS3StorageType && s3Context) {
    const {
      isLocalZone,
      versioningStatus,
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
      trackClick,
      trackAction,
      shouldHideButton,
      hasStandardInfrequentAccess,
    } = s3Context;

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
                {isS3StorageType &&
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

  if (!isS3StorageType && swiftContext) {
    const {
      searchField,
      setSearchField,
      handleSearch,
      filterColumns,
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
    } = swiftContext;

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
              onOdsChange={({ detail }) =>
                setSearchField(detail.value as string)
              }
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

  return null;
}
