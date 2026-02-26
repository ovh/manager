import { Fragment, JSX, ReactNode, useMemo } from 'react';
import {
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
  flexRender,
  Row,
  Table as TanstackTable,
  type ColumnDef,
} from '@tanstack/react-table';
import { FilterCategories } from '@ovh-ux/manager-core-api';
import {
  FilterAdd,
  FilterList,
  DatagridColumn,
  SearchProps,
  FilterProps,
  RowSelectionProps,
  ExpandedProps,
} from '@ovh-ux/muk';
import type { ColumnFilter } from '@ovh-ux/muk';
import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  Checkbox,
  CheckboxControl,
  ICON_NAME,
  Icon,
  Input,
  POPOVER_POSITION,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
  Table,
  TABLE_SIZE,
  Text,
} from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import type { ZoneRecord } from '@/zone/types/zoneRecords.types';

const LOADING_ROW_KEYS = Array.from({ length: 10 }, (_, i) => `loading-skeleton-${i}`);

interface ZoneDnsDatagridProps {
  readonly columns: DatagridColumn<ZoneRecord>[];
  readonly data: ZoneRecord[];
  readonly topbar?: ReactNode;
  readonly search?: SearchProps;
  readonly filters?: FilterProps;
  readonly rowSelection?: RowSelectionProps<ZoneRecord>;
  readonly hasNextPage?: boolean;
  readonly onFetchNextPage?: () => void;
  readonly onFetchAllPages?: () => void;
  readonly totalCount?: number;
  readonly isLoading?: boolean;
  readonly expandable?: ExpandedProps<ZoneRecord>;
  readonly renderSubComponent?: (row: Row<ZoneRecord>) => JSX.Element;
}

export default function ZoneDnsDatagrid({
  columns,
  data,
  topbar,
  search,
  filters,
  rowSelection,
  hasNextPage,
  onFetchNextPage,
  onFetchAllPages,
  totalCount,
  isLoading,
  expandable,
  renderSubComponent,
}: ZoneDnsDatagridProps) {
  const { t } = useTranslation('datagrid');
  const { t: tFilters } = useTranslation('filters');

  const selectionColumn = useMemo(
    () => ({
      id: 'row-selection',
      cell: ({ row }: { row: Row<ZoneRecord> }) => (
        <Checkbox
          id={row.id}
          name={`select-${row.id}`}
          onChange={() => row.toggleSelected()}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
        >
          <CheckboxControl />
        </Checkbox>
      ),
      enableResizing: true,
      header: ({ table }: { table: TanstackTable<ZoneRecord> }) => (
        <Checkbox
          id="select-all"
          name="select-all"
          onChange={() => table.toggleAllRowsSelected()}
          checked={table.getIsAllRowsSelected()}
        >
          <CheckboxControl />
        </Checkbox>
      ),
      maxSize: 50,
      minSize: 50,
      enableHiding: false,
    }),
    [],
  );

  const tableColumns = useMemo(
    () => (rowSelection ? [selectionColumn, ...columns] : [...columns]),
    [rowSelection, selectionColumn, columns],
  );

  const table = useReactTable<ZoneRecord>({
    data,
    columns: tableColumns as ColumnDef<ZoneRecord>[],
    state: {
      ...(rowSelection && { rowSelection: rowSelection.rowSelection }),
      ...(expandable && { expanded: expandable.expanded }),
    },
    getRowId: (row) => row.id,
    onRowSelectionChange: rowSelection?.setRowSelection,
    onExpandedChange: expandable?.setExpanded,
    getRowCanExpand: expandable?.getRowCanExpand ?? (() => true),
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    enableRowSelection: rowSelection
      ? (rowSelection.enableRowSelection ?? (() => true))
      : false,
  });

  const { rows } = table.getRowModel();
  const headerGroups = table.getHeaderGroups();
  const visibleColumns = table.getAllLeafColumns();

  const filterableColumns = useMemo<ColumnFilter[]>(
    () =>
      columns
        .filter((col) => col.isFilterable)
        .map((col) => ({
          id: col.id || '',
          label: col.label || (typeof col.header === 'string' ? col.header : '') || '',
          comparators:
            col.comparator ||
            FilterCategories[col.type as keyof typeof FilterCategories] ||
            [],
          ...(col.type && { type: col.type }),
          ...(col.filterOptions && { options: col.filterOptions }),
        })),
    [columns],
  );

  const hasSearchFeature = useMemo(
    () => columns.some((col) => col.isSearchable),
    [columns],
  );
  const hasFilterFeature = filterableColumns.length > 0;

  const shouldRenderTopbar = topbar || hasSearchFeature || hasFilterFeature;

  return (
    <>
      {shouldRenderTopbar && (
        <>
          <div
            data-testid="topbar-container"
            className="flex flex-wrap justify-between pb-6 items-center"
          >
            <div className="flex-1 w-full sm:w-auto sm:order-1 mr-4">
              {topbar && <>{topbar}</>}
            </div>
            <div className="w-full mt-[10px] sm:mt-[0px] sm:w-auto sm:order-3">
              <div className="flex justify-end items-center">
                {hasSearchFeature && search && (
                  <form
                    className="mr-[5px]"
                    onSubmit={(e) => {
                      search.onSearch(search.searchInput);
                      e.preventDefault();
                    }}
                  >
                    <Input
                      aria-label={t('common_search_placeholder')}
                      onClear={() => {
                        search.onSearch('');
                        search.setSearchInput('');
                      }}
                      onChange={(e) => {
                        search.setSearchInput(e.target.value);
                      }}
                      placeholder={search.placeholder}
                      clearable
                      type="search"
                      value={search.searchInput}
                    />
                  </form>
                )}
                {hasFilterFeature && (
                  <div className="ml-[10px]" data-testid="datagrid-topbar-filters">
                    <Popover position={POPOVER_POSITION.bottom}>
                      <PopoverTrigger asChild>
                        <Button
                          aria-label={tFilters('common_criteria_adder_filter_label')}
                          size={BUTTON_SIZE.sm}
                          variant={BUTTON_VARIANT.ghost}
                        >
                          <>
                            <Icon name={ICON_NAME.filter} />
                            {tFilters('common_criteria_adder_filter_label')}
                          </>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent createPortal={false} className="min-w-[320px] box-border">
                        <FilterAdd
                          columns={filterableColumns}
                          onAddFilter={(addedFilter, column) => {
                            if (filters && addedFilter.value !== undefined) {
                              filters.add({
                                key: addedFilter.key,
                                comparator: addedFilter.comparator,
                                value: addedFilter.value,
                                label: column.label,
                              });
                            }
                          }}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                )}
              </div>
            </div>
          </div>
          {filters && filters.filters.length > 0 && (
            <div data-testid="datagrid-filter-list" className="mb-[24px]">
              <FilterList filters={filters.filters} onRemoveFilter={filters.remove} />
            </div>
          )}
        </>
      )}

      <div className="overflow-auto relative w-full">
        <Table className="table table-fixed w-full" size={TABLE_SIZE.sm}>
          <thead className="sticky top-[-1px] z-10 bg-white overflow-hidden">
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left pl-4 whitespace-normal"
                    style={{
                      wordBreak: 'break-word',
                      width: header.column.getSize(),
                      minWidth: header.column.columnDef.minSize ?? 0,
                      maxWidth: header.column.columnDef.maxSize ?? 'auto',
                    }}
                  >
                    {!header.isPlaceholder && (
                      <>{flexRender(header.column.columnDef.header, header.getContext())}</>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          {rows.length === 0 && !isLoading ? (
            <tbody>
              <tr className="h-[3.25rem] w-full">
                <td
                  className="absolute text-center w-full py-[15px]"
                  style={{
                    borderRight: '1px solid var(--ods-color-neutral-100)',
                    left: 0,
                  }}
                >
                  <Text>{t('common_pagination_no_results')}</Text>
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {rows.map((row) => (
                <Fragment key={`table-body-tr-${row.id}`}>
                  <tr>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="pl-4 align-middle"
                        style={{
                          width: cell.column.getSize(),
                          minWidth: cell.column.columnDef.minSize ?? 0,
                          maxWidth: cell.column.columnDef.maxSize ?? 'auto',
                        }}
                      >
                        <div
                          className="overflow-hidden text-ellipsis flex items-center w-full"
                          style={{ lineHeight: 1 }}
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </div>
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && renderSubComponent && (
                    <tr>
                      <td
                        colSpan={row.getVisibleCells().length}
                        className="overflow-hidden p-4"
                      >
                        {renderSubComponent(row)}
                      </td>
                    </tr>
                  )}
                </Fragment>
              ))}
              {isLoading && (
                <>
                  {LOADING_ROW_KEYS.map((key) => (
                    <tr key={key} className="h-[50px]">
                      {visibleColumns.map(
                        (col) =>
                          col.getIsVisible() && (
                            <td
                              className="overflow-hidden py-[8px]"
                              key={`loading-cell-${key}-${col.id}`}
                            >
                              <div aria-busy="true" className="w-full">
                                <Skeleton />
                              </div>
                            </td>
                          ),
                      )}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          )}
        </Table>
      </div>

      {(onFetchAllPages || onFetchNextPage || !!totalCount) && (
        <div className="flex justify-center items-center pt-3">
          <div className="flex-1" />
          <div className="flex-[2] flex justify-center">
            {(onFetchNextPage || onFetchAllPages) && hasNextPage && (
              <div className="flex justify-center gap-5">
                {onFetchNextPage && (
                  <Button
                    data-testid="load-more-btn"
                    size={BUTTON_SIZE.sm}
                    variant={BUTTON_VARIANT.outline}
                    onClick={onFetchNextPage}
                    loading={isLoading}
                  >
                    {t('common_pagination_load_more')}
                  </Button>
                )}
                {onFetchAllPages && (
                  <Button
                    data-testid="load-all-btn"
                    size={BUTTON_SIZE.sm}
                    variant={BUTTON_VARIANT.outline}
                    onClick={onFetchAllPages}
                    loading={isLoading}
                  >
                    {t('common_pagination_load_all')}
                  </Button>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 flex justify-end">
            {totalCount ? (
              <div className="text-right h-full flex items-center justify-end">
                <Text>
                  {rows.length}{' '}
                  {`${t('common_pagination_of')} ${totalCount}`}{' '}
                  {t('common_pagination_results')}
                </Text>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
