import { ColumnDef } from '@tanstack/react-table';

import { SortableHeader } from '@/components/ui/data-table';

import UserStatusBadge from '../../users/_components/userStatusBadge';
import FormattedDate from '@/components/table-date';
import { BackupWithExpiricyDate } from '..';

export const getColumns = () => {
  const nameColumn: ColumnDef<BackupWithExpiricyDate> = {
    id: 'name',
    header: ({ column }) => (
      <SortableHeader column={column}>Name</SortableHeader>
    ),
    accessorFn: (row) => row.description,
  };
  const locationColumn: ColumnDef<BackupWithExpiricyDate> = {
    id: 'location',
    header: 'Location',
    accessorFn: (row) => row.regions.map((r) => r.name).join(', '),
  };
  const creationDateColumn: ColumnDef<BackupWithExpiricyDate> = {
    id: 'Creation date',
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <SortableHeader column={column}>Creation date</SortableHeader>
    ),
    cell: ({ row }) => (
      <FormattedDate date={new Date(row.original.createdAt)} />
    ),
  };
  const expiryDateColumn: ColumnDef<BackupWithExpiricyDate> = {
    id: 'Expiry date',
    accessorFn: (row) => row.expiricyDate,
    header: ({ column }) => (
      <SortableHeader column={column}>Expiry date</SortableHeader>
    ),
    cell: ({ row }) => {
      return <FormattedDate date={row.original.expiricyDate} />;
    },
  };
  const statusColumn: ColumnDef<BackupWithExpiricyDate> = {
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
