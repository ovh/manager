import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@datatr-ux/uxlib';
import { useTranslation } from 'react-i18next';
import ai from '@/types/AI';
import DataTable from '@/components/data-table';

interface BackupsListColumnsProps {
  onForkClicked: (backup: ai.notebook.Backup) => void;
}

export const getColumns = ({ onForkClicked }: BackupsListColumnsProps) => {
  const { t } = useTranslation('ai-tools/notebooks/notebook/backups');
  const columns: ColumnDef<ai.notebook.Backup>[] = [
    {
      id: 'Id',
      accessorFn: (row) => row.id,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderId')}
        </DataTable.SortableHeader>
      ),
    },
    {
      id: 'CreationDate',
      accessorFn: (row) => row.createdAt,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderCreationDate')}
        </DataTable.SortableHeader>
      ),
    },
    {
      id: 'UpdateDate',
      accessorFn: (row) => row.updatedAt,
      header: ({ column }) => (
        <DataTable.SortableHeader column={column}>
          {t('tableHeaderUpdateDate')}
        </DataTable.SortableHeader>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                data-testid="backup-action-trigger"
                variant="menu"
                size="menu"
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              data-testid="backup-action-content"
              align="end"
            >
              <DropdownMenuLabel>
                {t('backupDropdownMenuLabel')}
              </DropdownMenuLabel>
              <DropdownMenuItem
                data-testid="backup-action-fork-button"
                variant="primary"
                onClick={() => {
                  onForkClicked(row.original);
                }}
              >
                {t('tableActionFork')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  return columns;
};
