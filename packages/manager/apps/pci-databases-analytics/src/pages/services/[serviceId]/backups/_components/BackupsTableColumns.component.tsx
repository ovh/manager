import { ColumnDef } from '@tanstack/react-table';

import { useTranslation } from 'react-i18next';
import { MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
} from '@datatr-ux/uxlib';
import UserStatusBadge from '../../users/_components/UserStatusBadge.component';
import FormattedDate from '@/components/formatted-date/FormattedDate.component';
import { BackupWithExpiricyDate } from '../Backups.page';
import { useServiceData } from '../../Service.context';
import * as database from '@/types/cloud/project/database';
import DataTable from '@/components/data-table';
import { MENU_COLUMN_ID } from '@/components/data-table/DataTable.component';

interface BackupsTableColumnsProps {
  onForkClick: (backup: BackupWithExpiricyDate) => void;
  onRestoreClick: (backup: BackupWithExpiricyDate) => void;
}
export const getColumns = ({
  onForkClick,
  onRestoreClick,
}: BackupsTableColumnsProps) => {
  const { t } = useTranslation(
    'pci-databases-analytics/services/service/backups',
  );
  const { service } = useServiceData();
  const { t: tRegions } = useTranslation('regions');
  const nameColumn: ColumnDef<BackupWithExpiricyDate> = {
    id: 'name',
    header: ({ column }) => (
      <DataTable.SortableHeader column={column}>
        {t('tableHeadName')}
      </DataTable.SortableHeader>
    ),
    accessorFn: (row) => row.description,
  };
  const locationColumn: ColumnDef<BackupWithExpiricyDate> = {
    id: 'location',
    header: t('tableHeadLocation'),
    accessorFn: (row) =>
      row.regions.map((r) => tRegions(`region_${r.name}`)).join(', '),
  };
  const creationDateColumn: ColumnDef<BackupWithExpiricyDate> = {
    id: 'Creation date',
    accessorFn: (row) => row.createdAt,
    header: ({ column }) => (
      <DataTable.SortableHeader column={column}>
        {t('tableHeadCreationDate')}
      </DataTable.SortableHeader>
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
      <DataTable.SortableHeader column={column}>
        {t('tableHeadNExpiryDate')}
      </DataTable.SortableHeader>
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
      <DataTable.SortableHeader column={column}>
        {t('tableHeadStatus')}
      </DataTable.SortableHeader>
    ),
    cell: ({ row }) => {
      return <UserStatusBadge status={row.original.status} />;
    },
  };
  const actionsColumn: ColumnDef<BackupWithExpiricyDate> = {
    id: MENU_COLUMN_ID,
    cell: ({ row }) => {
      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="backups-action-trigger"
                variant="menu"
                size="menu"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {service.capabilities.backupRestore?.create && (
                <DropdownMenuItem
                  data-testid="backups-action-restore-button"
                  disabled={
                    service.capabilities.backupRestore.create ===
                    database.service.capability.StateEnum.disabled
                  }
                  variant="primary"
                  onClick={() => {
                    onRestoreClick(row.original);
                  }}
                  className="w-full"
                >
                  {t('tableActionRestore')}
                </DropdownMenuItem>
              )}
              {service.capabilities.fork?.create && (
                <DropdownMenuItem
                  data-testid="backups-action-fork-button"
                  disabled={
                    service.capabilities.fork.create ===
                    database.service.capability.StateEnum.disabled
                  }
                  variant="primary"
                  onClick={() => {
                    onForkClick(row.original);
                  }}
                  className="w-full"
                >
                  {t('tableActionFork')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  };

  return [
    nameColumn,
    locationColumn,
    creationDateColumn,
    expiryDateColumn,
    statusColumn,
    actionsColumn,
  ];
};
