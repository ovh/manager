import { memo, useMemo } from 'react';
import { ColumnVisibility } from './columns-visibility/ColumnsVisibility.component';
import { ColumnsVisibilityProps } from './columns-visibility/ColumnsVisiblity.props';

const TopbarComponent = <T,>({
  topbar,
  visibleColumns,
  setColumnVisibility,
  toggleAllColumnsVisible,
  getIsAllColumnsVisible,
  getIsSomeColumnsVisible,
}: ColumnsVisibilityProps<T>) => {
  const hasVisibilityFeature = useMemo(
    () => visibleColumns?.some((col) => col.columnDef.enableHiding),
    [visibleColumns],
  );
  return (
    <>
      <div
        id="container"
        className="flex flex-wrap justify-between pb-6 items-center"
      >
        <div id="left-side" className="flex-1 w-full md:w-auto md:order-1 mr-4">
          {topbar && <>{topbar}</>}
        </div>
        <div
          id="right-side"
          className="w-full mt-[10px] md:mt-[0px] md:w-auto md:order-3"
        >
          <div className="flex justify-end items-center">
            {/* {isSearchable && ( */}
            <form
              className="mr-[5px]"
              // onSubmit={(e) => {
              //   e.preventDefault();
              //   search?.onSearch(search?.searchInput);
              // }}
            >
              Ods input search ici
              {/* <OdsInput
                  isClearable
                  onOdsClear={() => {
                    search?.onSearch('');
                    search?.setSearchInput('');
                  }}
                  type={ODS_INPUT_TYPE.search}
                  id="datagrid-searchbar"
                  name="datagrid-searchbar"
                  placeholder={search?.placeholder}
                  defaultValue={search?.searchInput}
                  data-testid="datagrid-searchbar"
                  onOdsChange={(event) =>
                    search?.setSearchInput(
                      event?.detail?.value?.toString() || '',
                    )
                  }
                  value={search?.searchInput}
                /> */}
            </form>
            {/* )} */}
            {/* {filtersColumns?.length > 0 && ( */}
            <div className="ml-[10px]" data-testid="datagrid-topbar-filters">
              {/* <OdsButton
                id="datagrid-filter-popover-trigger"
                slot="datagrid-filter-popover-trigger"
                size={ODS_BUTTON_SIZE.sm}
                variant={ODS_BUTTON_VARIANT.outline}
                icon={ODS_ICON_NAME.filter}
                aria-label={t('common_criteria_adder_filter_label')}
                label={t('common_criteria_adder_filter_label')}
              />
              <OdsPopover
                ref={filterPopoverRef}
                triggerId="datagrid-filter-popover-trigger"
                with-arrow
              >
                <FilterAdd
                  columns={filtersColumns}
                  resourceType={resourceType}
                  onAddFilter={(addedFilter, column) => {
                    filters.add({
                      ...addedFilter,
                      label: column.label,
                    });
                    filterPopoverRef.current?.hide();
                  }}
                />
              </OdsPopover> */}
              Filtre ici
            </div>
            {/* )} */}
            {/* <div className={filtersColumns?.length > 0 ? 'ml-[10px]' : ''}> */}
            {setColumnVisibility && hasVisibilityFeature && (
              <div className="ml-[10px]">
                {visibleColumns.length > 0 && (
                  <ColumnVisibility<T>
                    visibleColumns={visibleColumns}
                    toggleAllColumnsVisible={toggleAllColumnsVisible}
                    getIsAllColumnsVisible={getIsAllColumnsVisible}
                    getIsSomeColumnsVisible={getIsSomeColumnsVisible}
                  />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* {filters?.filters.length > 0 && ( */}
      <div
        data-testid="datagrid-filter-list"
        id="datagrid-filter-list"
        className="mb-[24px]"
      >
        List des filtres ici
        {/* <FilterList
            filters={filters.filters}
            onRemoveFilter={filters.remove}
          /> */}
      </div>
      {/* )} */}
    </>
  );
};

export const Topbar = memo(TopbarComponent) as <T>(
  props: ColumnsVisibilityProps<T>,
) => JSX.Element;
