import { ColumnDef } from '@tanstack/react-table';

import { SortableHeader } from '@/components/ui/data-table';

import { ai } from '@/models/types';

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
        <SortableHeader column={column}>Mount directory</SortableHeader>
      ),
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
