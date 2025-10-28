import { getCoreRowModel, getExpandedRowModel, getSortedRowModel } from '@tanstack/react-table';
import type { TableOptions } from '@tanstack/react-table';

import { ExpandableRow } from '../useDatagrid.props';
import { TableBuilderProps } from './TableBuilderProps.props';
import { getExpandable, getRowSelection } from './TableHeaderBuilder';

export const useTableBuilder = <T extends ExpandableRow<T>>({
  columns,
  columnVisibility,
  data,
  expandable,
  hasExpandableFeature,
  hasSortingFeature,
  manualSorting,
  onSortChange,
  renderSubComponent,
  rowSelection,
  setColumnVisibility,
  sorting,
}: TableBuilderProps<T>) => {
  const params: Partial<TableOptions<T>> = {};
  const builder = {
    build: () => params as TableOptions<T>,
    setColumns: () => {
      let cols = [...columns];
      if (rowSelection) {
        cols = [getRowSelection(), ...cols];
      }
      if ((hasExpandableFeature && expandable) || !!renderSubComponent) {
        cols = [getExpandable(expandable), ...cols];
      }
      params.columns = cols;
      return builder;
    },
    setColumnsVisibility: () => {
      if (columnVisibility && setColumnVisibility) {
        params.onColumnVisibilityChange = (updaterOrValue) => {
          if (typeof updaterOrValue === 'function') {
            setColumnVisibility(updaterOrValue(columnVisibility));
          } else {
            setColumnVisibility(updaterOrValue);
          }
        };
      }
      return builder;
    },
    setCoreRowModel: () => {
      params.getCoreRowModel = getCoreRowModel();
      return builder;
    },
    setData: () => {
      params.data = data;
      return builder;
    },
    setExpanded: () => {
      if (hasExpandableFeature && expandable?.setExpanded) {
        params.onExpandedChange = expandable.setExpanded;
      }
      return builder;
    },
    setExpandedRowModel: () => {
      if (hasExpandableFeature || !!renderSubComponent) {
        params.getRowCanExpand = () => true;
        params.getExpandedRowModel = getExpandedRowModel();
      }
      return builder;
    },
    setRowSelection: () => {
      if (rowSelection) {
        params.enableRowSelection = true;
        params.onRowSelectionChange = rowSelection.setRowSelection;
      }
      return builder;
    },
    setSorting: () => {
      if (hasSortingFeature && onSortChange) {
        params.onSortingChange = (updaterOrValue) => {
          if (typeof updaterOrValue === 'function') {
            onSortChange(updaterOrValue(sorting || []));
          } else {
            onSortChange(updaterOrValue);
          }
        };
        params.getSortedRowModel = getSortedRowModel();
        params.manualSorting = manualSorting;
      }
      return builder;
    },
    setState: () => {
      params.state = {
        ...(hasSortingFeature && !!onSortChange && { sorting }),
        ...(columnVisibility && !!setColumnVisibility && { columnVisibility }),
        ...(rowSelection && { rowSelection: rowSelection.rowSelection }),
        ...(hasExpandableFeature && { expanded: expandable?.expanded ?? {} }),
      };
      return builder;
    },
    setSubRows: () => {
      params.getSubRows = (row: T) => row?.subRows;
      return builder;
    },
  };
  return builder;
};
