import { useState } from 'react';
import { VisibilityState } from '@tanstack/react-table';
import { DatagridColumn } from '@ovh-ux/muk';

export const useDomainListState = <T extends Record<string, unknown>>(
  domainColumns: DatagridColumn<T>[],
) => {
  const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    () => {
      const allowedVisibleColumns = new Set([
        'domain',
        'state',
        'suspensionState',
        'pendingActions',
        'renewFrequency',
        'expiration',
        'contactOwner.id',
        'actions',
      ]);

      return domainColumns.reduce<VisibilityState>((acc, column) => {
        if (column.id && !allowedVisibleColumns.has(column.id)) {
          acc[column.id] = false;
        }
        return acc;
      }, {});
    },
  );

  const selectedServiceNames = Object.keys(rowSelection);

  return {
    rowSelection,
    setRowSelection,
    columnVisibility,
    setColumnVisibility,
    selectedServiceNames,
  };
};
