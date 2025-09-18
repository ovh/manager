import { useRef, useMemo, useState } from 'react';
import { Table } from '@ovhcloud/ods-react';
import { VisibilityState } from '@tanstack/react-table';
import { TableHeaderContent } from './table/table-head/table-header-content/TableHeaderContent.component';
import { TableFooter } from './table/table-footer/TableFooter.component';
import { TableBody } from './table/table-body/TableBody.component';
import { useDatagrid } from './useDatagrid';
import { DatagridProps } from './Datagrid.props';
import { Topbar } from './topbar/Topbar.component';

import './translations';

const DEFAULT_ROW_HEIGHT = 50;

export const Datagrid = <T extends Record<string, unknown>>({
  columns,
  data,
  onSortChange,
  sorting,
  manualSorting = false,
  contentAlignLeft = true,
  hasNextPage,
  onFetchAllPages,
  onFetchNextPage,
  isLoading,
  containerHeight,
  totalCount,
  renderSubComponent,
  subComponentHeight,
  maxRowHeight = DEFAULT_ROW_HEIGHT,
  expandable = false,
  autoScroll = true,
  columnVisibility,
  setColumnVisibility,
  topbar,
}: DatagridProps<T>) => {
  const dataMemo = useMemo(() => data, [data]);
  const columnsMemo = useMemo(() => columns, []);
  const {
    getHeaderGroups,
    getRowModel,
    getAllLeafColumns,
    toggleAllColumnsVisible,
    getIsAllColumnsVisible,
    getIsSomeColumnsVisible,
  } = useDatagrid({
    columns: columnsMemo,
    data: dataMemo,
    sorting,
    onSortChange,
    manualSorting,
    renderSubComponent,
    expandable,
    columnVisibility,
    setColumnVisibility,
  });
  const rowModel = getRowModel();
  const { rows } = rowModel;
  const headerGroups = getHeaderGroups();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const visibleColumns = useMemo(
    () => getAllLeafColumns(),
    [getAllLeafColumns()],
  );
  return (
    <>
      <Topbar
        topbar={topbar}
        visibleColumns={visibleColumns}
        toggleAllColumnsVisible={toggleAllColumnsVisible}
        getIsAllColumnsVisible={getIsAllColumnsVisible}
        getIsSomeColumnsVisible={getIsSomeColumnsVisible}
        setColumnVisibility={setColumnVisibility}
      />
      <div
        className="overflow-auto relative w-full"
        ref={tableContainerRef}
        style={{
          maxHeight: containerHeight ? `${containerHeight}px` : '570px',
          height: containerHeight
            ? `${containerHeight}px`
            : data?.length < 10
              ? '100%'
              : '570px',
        }}
      >
        <Table className="w-full">
          <TableHeaderContent<T>
            headerGroups={headerGroups}
            onSortChange={onSortChange}
            sorting={sorting}
            contentAlignLeft={contentAlignLeft}
          />
          <TableBody
            autoScroll={autoScroll}
            rowModel={rowModel}
            tableContainerRef={tableContainerRef}
            isLoading={isLoading}
            renderSubComponent={renderSubComponent}
            subComponentHeight={subComponentHeight}
            maxRowHeight={maxRowHeight}
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
