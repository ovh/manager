import { ColumnDef } from '@tanstack/react-table';

import { useTranslation } from 'react-i18next';
import { SortableHeader } from '@/components/ui/data-table';

import UserStatusBadge from '../../users/_components/userStatusBadge';
import FormattedDate from '@/components/table-date';
import { BackupWithExpiricyDate } from '..';

export const getColumns = () => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/backups',
  );
  const nameColumn: ColumnDef<BackupWithExpiricyDate> = {
    id: 'name',
    header: ({ column }) => (
      <SortableHeader column={column}>{t('tableHeadName')}</SortableHeader>
    ),
    accessorFn: (row) => row.description,
  };
  const locationColumn: ColumnDef<BackupWithExpiricyDate> = {
    id: 'location',
    header: t('tableHeadLocation'),
    accessorFn: (row) => row.regions.map((r) => r.name).join(', '),
  };
  const creationDateColumn: ColumnDef<BackupWithExpiricyDate> = {
    id: 'Creation date',
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <SortableHeader column={column}>
        {t('tableHeadCreationDate')}
      </SortableHeader>
    ),
    cell: ({ row }) => (
      <FormattedDate
        date={new Date(row.original.createdAt)}
        options={{
          dateStyle: 'medium',
          timeStyle: 'medium',
        }}
      />
    ),
  };
  const expiryDateColumn: ColumnDef<BackupWithExpiricyDate> = {
    id: 'Expiry date',
    accessorFn: (row) => row.expiricyDate,
    header: ({ column }) => (
      <SortableHeader column={column}>
        {t('tableHeadNExpiryDate')}
      </SortableHeader>
    ),
    cell: ({ row }) => {
      return (
        <FormattedDate
          date={row.original.expiricyDate}
          options={{
            dateStyle: 'medium',
            timeStyle: 'medium',
          }}
        />
      );
    },
  };
  const statusColumn: ColumnDef<BackupWithExpiricyDate> = {
    id: 'Status',
    accessorFn: (row) => row.status,
    header: ({ column }) => (
      <SortableHeader column={column}>{t('tableHeadStatus')}</SortableHeader>
    ),
    cell: ({ row }) => {
      return <UserStatusBadge status={row.original.status} />;
    },
  };

  return [
    nameColumn,
    locationColumn,
    creationDateColumn,
    expiryDateColumn,
    statusColumn,
    // actionsColumn
  ] as ColumnDef<BackupWithExpiricyDate>[];
};
