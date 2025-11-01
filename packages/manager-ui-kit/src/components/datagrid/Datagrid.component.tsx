import { useRef } from 'react';

import { TABLE_SIZE, TABLE_VARIANT, Table } from '@ovhcloud/ods-react';

import { ContainerHeight, DatagridProps, RowHeight } from './Datagrid.props';
import { TableBody } from './table/table-body/TableBody.component';
import { TableFooter } from './table/table-footer/TableFooter.component';
import { TableHeaderContent } from './table/table-head/table-header-content/TableHeaderContent.component';
import { Topbar } from './topbar/Topbar.component';
import './translations';
import { useDatagrid } from './useDatagrid';

export const Datagrid = <T extends Record<string, unknown>>({
  autoScroll = true,
  columns,
  columnVisibility,
  containerHeight,
  contentAlignLeft = true,
  data,
  expandable,
  filters,
  hasNextPage,
  isLoading,
  maxRowHeight,
  resourceType,
  rowSelection,
  search,
  sorting,
  size = TABLE_SIZE.md,
  subComponentHeight,
  topbar,
  totalCount,
  variant = TABLE_VARIANT.default,
  onFetchAllPages,
  onFetchNextPage,
  renderSubComponent,
}: DatagridProps<T>) => {
  const rowHeight = RowHeight[size];
  const DEFAULT_CONTAINER_HEIGHT = maxRowHeight || ContainerHeight[size];
  const {
    features,
    getHeaderGroups,
    getRowModel,
    getAllLeafColumns,
    toggleAllColumnsVisible,
    getIsAllColumnsVisible,
    getIsSomeColumnsVisible,
  } = useDatagrid({
    columns,
    data,
    sorting: sorting?.sorting,
    onSortChange: sorting?.setSorting,
    manualSorting: sorting?.manualSorting,
    renderSubComponent,
    columnVisibility: columnVisibility?.columnVisibility,
    setColumnVisibility: columnVisibility?.setColumnVisibility,
    rowSelection,
    expandable,
    sizeRow: size,
  });
  const { hasSortingFeature, hasSearchFeature, hasColumnVisibilityFeature, hasFilterFeature } =
    features;
  const rowModel = getRowModel();
  const { rows } = rowModel;
  const headerGroups = getHeaderGroups();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const visibleColumns = getAllLeafColumns();
  const containerSize = data?.length < 10 ? '100%' : `${DEFAULT_CONTAINER_HEIGHT}px`;
  const containerStyle = {
    maxHeight: containerHeight ? `${containerHeight}px` : containerSize,
    height: containerHeight ? `${containerHeight}px` : containerSize,
  };
  const shouldRenderTopbar =
    topbar || hasSearchFeature || hasFilterFeature || hasColumnVisibilityFeature;

  return (
    <>
      {shouldRenderTopbar && (
        <Topbar
          columns={columns}
          topbar={topbar}
          search={search}
          resourceType={resourceType}
          filters={filters}
          enableFilter={hasFilterFeature}
          enableSearch={hasSearchFeature}
          enableColumnvisibility={hasColumnVisibilityFeature}
          visibleColumns={visibleColumns}
          toggleAllColumnsVisible={toggleAllColumnsVisible}
          getIsAllColumnsVisible={getIsAllColumnsVisible}
          getIsSomeColumnsVisible={getIsSomeColumnsVisible}
          setColumnVisibility={columnVisibility?.setColumnVisibility}
        />
      )}
      <div className="overflow-auto relative w-full" ref={tableContainerRef} style={containerStyle}>
        <Table size={size} variant={variant}>
          <TableHeaderContent<T>
            headerGroups={headerGroups}
            onSortChange={sorting?.setSorting}
            enableSorting={hasSortingFeature}
            contentAlignLeft={contentAlignLeft}
          />
          <TableBody
            columns={visibleColumns}
            autoScroll={autoScroll}
            expanded={expandable?.expanded ?? {}}
            rowModel={rowModel}
            tableContainerRef={tableContainerRef}
            isLoading={isLoading ?? false}
            renderSubComponent={renderSubComponent}
            subComponentHeight={subComponentHeight}
            maxRowHeight={rowHeight}
            contentAlignLeft={contentAlignLeft}
          />
        </Table>
      </div>
      <TableFooter
        hasNextPage={hasNextPage}
        onFetchAllPages={onFetchAllPages}
        onFetchNextPage={onFetchNextPage}
        isLoading={isLoading}
        totalCount={totalCount}
        itemsCount={rows?.length}
      />
    </>
  );
};
