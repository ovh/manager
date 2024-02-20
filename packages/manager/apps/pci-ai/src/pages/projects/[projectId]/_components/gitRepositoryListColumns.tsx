import { ColumnDef } from '@tanstack/react-table';

import { SortableHeader } from '@/components/ui/data-table';

import { ai } from '@/models/types';
import MountDirectoryColumn from './mountDirectoryCol';

export const getColumns = () => {
  const columns: ColumnDef<ai.volume.Volume>[] = [
    {
      id: 'git',
      accessorFn: (row) => row.publicGit?.url,
      header: ({ column }) => (
        <SortableHeader column={column}>Git repository URL</SortableHeader>
      ),
    },
    {
      id: 'directory',
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
  ];
  return columns;
};
