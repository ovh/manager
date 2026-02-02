import { useState } from 'react';

import { TABLE_SIZE, TABLE_VARIANT, Table } from '@ovhcloud/ods-react';

import {
  ContainerHeight,
  ContainerWihtoutHeaderHeight,
  DatagridProps,
  RowHeight,
} from '@/components/datagrid/Datagrid.props';
import { TableHeaderContent } from '@/components/datagrid/table/table-head';

import { TableBody } from './table/table-body/TableBody.component';
import { TableFooter } from './table/table-footer/TableFooter.component';
import { Topbar } from './topbar/Topbar.component';
import './translations';
import { useDatagrid } from './useDatagrid';

const DEFAULT_MIN_CONTAINER_HEIGHT = 150;

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
  hideHeader = false,
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
  const DEFAULT_CONTAINER_HEIGHT =
    maxRowHeight || (hideHeader ? ContainerWihtoutHeaderHeight[size] : ContainerHeight[size]);
  const { table, features } = useDatagrid({
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
  const rowModel = table.getRowModel();
  const { rows } = rowModel;
  const headerGroups = table.getHeaderGroups();
  const [tableContainerRef, setTableContainerRef] = useState<HTMLDivElement | null>(null);
  const visibleColumns = table.getAllLeafColumns();
  const containerSize = data?.length < 10 ? '100%' : `${DEFAULT_CONTAINER_HEIGHT}px`;
  const containerStyle = {
    minHeight: `${DEFAULT_MIN_CONTAINER_HEIGHT}px`,
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
          toggleAllColumnsVisible={table.toggleAllColumnsVisible}
          getIsAllColumnsVisible={table.getIsAllColumnsVisible}
          getIsSomeColumnsVisible={table.getIsSomeColumnsVisible}
          setColumnVisibility={columnVisibility?.setColumnVisibility}
        />
      )}
      <div
        className="overflow-auto relative w-full"
        ref={setTableContainerRef}
        style={containerStyle}
      >
        <Table className="table table-fixed w-full" size={size} variant={variant}>
          {!hideHeader && (
            <TableHeaderContent<T>
              headerGroups={headerGroups}
              onSortChange={sorting?.setSorting}
              enableSorting={hasSortingFeature}
              contentAlignLeft={contentAlignLeft}
            />
          )}
          <TableBody
            hideHeader={hideHeader}
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
