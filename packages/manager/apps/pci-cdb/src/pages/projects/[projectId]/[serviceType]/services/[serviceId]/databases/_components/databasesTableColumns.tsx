import { ColumnDef } from '@tanstack/react-table';

import { SortableHeader } from '@/components/ui/data-table';

import { database } from '@/models/database';

export const getColumns = () => {
  const nameColumn: ColumnDef<database.service.Database> = {
    id: 'name',
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
    accessorFn: (row) => row.name,
  };
  // TODO: add actions columns
  return [
    nameColumn,
    // actionsColumn
  ];
};
