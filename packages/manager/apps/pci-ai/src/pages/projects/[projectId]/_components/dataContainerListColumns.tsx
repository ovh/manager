import { ColumnDef } from '@tanstack/react-table';

import { SortableHeader } from '@/components/ui/data-table';

import { ai } from '@/models/types';
import MountDirectoryColumn from './mountDirectoryCol';

export const getColumns = () => {
  const columns: ColumnDef<ai.volume.Volume>[] = [
    {
      id: 'container',
      accessorFn: (row) => row.container,
      header: ({ column }) => (
        <SortableHeader column={column}>Data Container</SortableHeader>
      ),
    },
    {
      id: 'prefix',
      accessorFn: (row) => row.prefix,
      header: ({ column }) => (
        <SortableHeader column={column}>Prefix</SortableHeader>
      ),
    },
    {
      id: 'location',
      accessorFn: (row) => row.region,
      header: ({ column }) => (
        <SortableHeader column={column}>Location</SortableHeader>
      ),
    },
    {
      id: 'Path',
      accessorFn: (row) => row.mountPath,
      header: ({ column }) => (
        <SortableHeader column={column}>Mount Directory</SortableHeader>
      ),
      cell: ({ row }) => {
        return <MountDirectoryColumn mountPath = { row.original.mountPath } />;
      },
    },
    {
      id: 'permission',
      accessorFn: (row) => row.permission,
      header: ({ column }) => (
        <SortableHeader column={column}>Permission</SortableHeader>
      ),
    },
    {
      id: 'cache',
      accessorFn: (row) => row.cache,
      header: ({ column }) => (
        <SortableHeader column={column}>Cache</SortableHeader>
      ),
    },
  ];
  return columns;
};
