import { useRef, useMemo } from 'react';
import { Table } from '@ovhcloud/ods-react';
import { TableHeaderContent } from './table/table-head/table-header-content/TableHeaderContent.component';
import { TableFooter } from './table/table-footer/TableFooter.component';
import { TableBody } from './table/table-body/TableBody.component';
import { useDatagrid } from './useDatagrid';
import { DatagridProps } from './Datagrid.props';
import { Topbar } from './topbar/Topbar.component';
import './translations';

const DEFAULT_ROW_HEIGHT = 50;
const DEFAULT_CONTAINER_HEIGHT = 570;

export const Datagrid = <T extends Record<string, unknown>>({
  autoScroll = true,
  columns,
  columnVisibility,
  containerHeight,
  contentAlignLeft = true,
  data,
  enableColumnvisibility = false,
  enableFilter = false,
  enableSearch = false,
  expandable,
  filters,
  hasNextPage,
  isLoading,
  manualSorting = false,
  maxRowHeight = DEFAULT_ROW_HEIGHT,
  onFetchAllPages,
  onFetchNextPage,
  onSortChange,
  renderSubComponent,
  resourceType,
  rowSelection,
  search,
  setColumnVisibility,
  sorting,
  subComponentHeight,
  topbar,
  totalCount,
}: DatagridProps<T>) => {
  const dataMemo = useMemo(() => data, [data]);
  const columnsMemo = useMemo(() => columns, [columns]);
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
    columnVisibility,
    setColumnVisibility,
    rowSelection,
    expandable,
  });
  const rowModel = getRowModel();
  const { rows } = rowModel;
  const headerGroups = getHeaderGroups();
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const visibleColumns = useMemo(
    () => getAllLeafColumns(),
    [getAllLeafColumns()],
  );

  const containerHeightMemo =
    dataMemo?.length < 10 ? '100%' : `${DEFAULT_CONTAINER_HEIGHT}px`;
  const containerStyle = useMemo(
    () => ({
      maxHeight: containerHeight ? `${containerHeight}px` : containerHeightMemo,
      height: containerHeight ? `${containerHeight}px` : containerHeightMemo,
    }),
    [containerHeight, dataMemo?.length],
  );

  return (
    <>
      {(topbar || enableSearch || enableFilter || enableColumnvisibility) && (
        <Topbar
          columns={columnsMemo}
          topbar={topbar}
          search={search}
          resourceType={resourceType}
          filters={filters}
          enableFilter={enableFilter}
          enableSearch={enableSearch}
          enableColumnvisibility={enableColumnvisibility}
          visibleColumns={visibleColumns}
          toggleAllColumnsVisible={toggleAllColumnsVisible}
          getIsAllColumnsVisible={getIsAllColumnsVisible}
          getIsSomeColumnsVisible={getIsSomeColumnsVisible}
          setColumnVisibility={setColumnVisibility}
        />
      )}
      <div
        className="overflow-auto relative w-full"
        ref={tableContainerRef}
        style={containerStyle}
      >
        <Table className="w-full">
          <TableHeaderContent<T>
            headerGroups={headerGroups}
            onSortChange={onSortChange}
            sorting={sorting}
            contentAlignLeft={contentAlignLeft}
          />
          <TableBody
            columns={visibleColumns}
            autoScroll={autoScroll}
            expanded={expandable?.expanded}
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
