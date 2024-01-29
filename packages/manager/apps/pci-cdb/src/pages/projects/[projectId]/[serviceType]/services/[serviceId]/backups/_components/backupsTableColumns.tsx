import { ColumnDef } from '@tanstack/react-table';

import { SortableHeader } from '@/components/ui/data-table';

import { database } from '@/models/database';
import UserStatusBadge from '../../users/_components/userStatusBadge';
import FormattedDate from '@/components/table-date';

export const getColumns = () => {
  const nameColumn: ColumnDef<database.Backup> = {
    id: 'name',
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
    accessorFn: (row) => row.description,
  };
  const locationColumn: ColumnDef<database.Backup> = {
    id: 'location',
    header: 'Location',
    accessorFn: (row) => row.regions.map((r) => r.name).join(', '),
  };
  const creationDateColumn: ColumnDef<database.Backup> = {
    id: 'Creation date',
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <SortableHeader column={column}>Creation date</SortableHeader>
    ),
    cell: ({ row }) => (
      <FormattedDate date={new Date(row.original.createdAt)} />
    ),
  };
  const expiryDateColumn: ColumnDef<database.Backup> = {
    id: 'Creation date',
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <SortableHeader column={column}>Expiry date</SortableHeader>
    ),
    cell: ({ row }) => {
      // TODO: get retention days to compute expiry date
      const expiryDate = new Date(row.original.createdAt);
      return <FormattedDate date={expiryDate} />;
    },
  };
  const statusColumn: ColumnDef<database.Backup> = {
    id: 'Status',
    accessorFn: (row) => row.status,
    header: ({ column }) => (
      <SortableHeader column={column}>Status</SortableHeader>
    ),
    cell: ({ row }) => {
      return <UserStatusBadge status={row.original.status} />;
    },
    // TODO: add actions columns
  };

  return [
    nameColumn,
    locationColumn,
    creationDateColumn,
    expiryDateColumn,
    statusColumn,
    // actionsColumn
  ];
};
