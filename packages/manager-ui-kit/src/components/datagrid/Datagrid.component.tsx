import { useRef } from 'react';

import { Table } from '@ovhcloud/ods-react';

import { DatagridProps } from './Datagrid.props';
import { TableBody } from './table/table-body/TableBody.component';
import { TableFooter } from './table/table-footer/TableFooter.component';
import { TableHeaderContent } from './table/table-head/table-header-content/TableHeaderContent.component';
import { Topbar } from './topbar/Topbar.component';
import './translations';
import { useDatagrid } from './useDatagrid';

const DEFAULT_ROW_HEIGHT = 50;
const DEFAULT_CONTAINER_HEIGHT = 570;

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
  maxRowHeight = DEFAULT_ROW_HEIGHT,
  resourceType,
  rowSelection,
  search,
  sorting,
  subComponentHeight,
  topbar,
  totalCount,
  onFetchAllPages,
  onFetchNextPage,
  renderSubComponent,
}: DatagridProps<T>) => {
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
        <Table className="w-full">
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
            maxRowHeight={maxRowHeight}
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